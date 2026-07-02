import { createHash } from "node:crypto"
import { join } from "node:path"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { contactPolicy } from "@/lib/server/contact-policy"
import { deliverContactMessage } from "@/lib/server/contact-service"
import {
  enqueueContactOutboxEntry,
  getContactOutboxDiagnostics,
  readContactOutboxEntries,
  reapContactOutboxEntries,
  updateContactOutboxEntry,
} from "@/lib/server/contact-outbox"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-file-store"
import { logServerEvent } from "@/lib/server/logger"

type IdempotencyRecord = {
  fingerprint: string
  status: number
  body: Record<string, unknown>
  storedAt: number
}

type ReplayLockState = {
  requestId: string
  startedAt: number
  expiresAt: number
}

type ReplaySummary = {
  scanned: number
  delivered: number
  skipped: number
  failed: number
  remaining: number
}

type ReplayRuntimeState = {
  activeLock: ReplayLockState | null
  lastCompletedAt: number | null
  lastSummary: ReplaySummary | null
}

const idempotencyRecords = new Map<string, IdempotencyRecord>()
const IDEMPOTENCY_FILE_PATH = join(process.cwd(), ".data", "contact-idempotency.json")
const REPLAY_RUNTIME_FILE_PATH = join(process.cwd(), ".data", "contact-replay-runtime.json")

let idempotencyLoaded = false
let idempotencyWriteQueue = Promise.resolve()
let replayWriteQueue = Promise.resolve()

function normalizeIdempotencyKey(value: string | null) {
  const normalized = value?.trim()
  if (!normalized || normalized.length > 120) {
    return null
  }

  return normalized
}

function getSubmissionFingerprint(submission: ContactSubmission) {
  return createHash("sha256")
    .update(`${submission.email}\n${submission.project}\n${submission.locale}`)
    .digest("hex")
}

function pruneIdempotencyRecords(now: number) {
  for (const [key, record] of idempotencyRecords.entries()) {
    if (now - record.storedAt >= contactPolicy.idempotencyWindowMs) {
      idempotencyRecords.delete(key)
    }
  }
}

async function loadIdempotencyRecords(now: number) {
  if (idempotencyLoaded) {
    pruneIdempotencyRecords(now)
    return
  }

  const storedRecords = await readJsonFile<Array<[string, IdempotencyRecord]>>(IDEMPOTENCY_FILE_PATH, [])
  for (const [key, record] of storedRecords) {
    idempotencyRecords.set(key, record)
  }

  pruneIdempotencyRecords(now)
  idempotencyLoaded = true
}

function persistIdempotencyRecords() {
  idempotencyWriteQueue = idempotencyWriteQueue.then(() =>
    writeJsonFile(IDEMPOTENCY_FILE_PATH, Array.from(idempotencyRecords.entries())),
  )

  return idempotencyWriteQueue
}

async function readReplayRuntimeState(now = Date.now()) {
  const state = await readJsonFile<ReplayRuntimeState>(REPLAY_RUNTIME_FILE_PATH, {
    activeLock: null,
    lastCompletedAt: null,
    lastSummary: null,
  })

  if (state.activeLock && state.activeLock.expiresAt <= now) {
    return {
      ...state,
      activeLock: null,
    } satisfies ReplayRuntimeState
  }

  return state
}

function writeReplayRuntimeState(state: ReplayRuntimeState) {
  replayWriteQueue = replayWriteQueue.then(() => writeJsonFile(REPLAY_RUNTIME_FILE_PATH, state))
  return replayWriteQueue
}

export async function getIdempotencyReplay(request: Request, submission: ContactSubmission, now: number) {
  const key = normalizeIdempotencyKey(request.headers.get("idempotency-key"))
  if (!key) {
    return null
  }

  await loadIdempotencyRecords(now)

  if (idempotencyRecords.size > 500) {
    pruneIdempotencyRecords(now)
    await persistIdempotencyRecords()
  }

  const existingRecord = idempotencyRecords.get(key)
  if (!existingRecord) {
    return null
  }

  const fingerprint = getSubmissionFingerprint(submission)
  if (existingRecord.fingerprint !== fingerprint) {
    return {
      key,
      conflict: true as const,
    }
  }

  return {
    key,
    conflict: false as const,
    status: existingRecord.status,
    body: {
      ...existingRecord.body,
      replayed: true,
    },
  }
}

export async function storeIdempotencyReplay(
  request: Request,
  submission: ContactSubmission,
  response: { status: number; body: Record<string, unknown> },
) {
  const key = normalizeIdempotencyKey(request.headers.get("idempotency-key"))
  if (!key) {
    return null
  }

  await loadIdempotencyRecords(Date.now())

  idempotencyRecords.set(key, {
    fingerprint: getSubmissionFingerprint(submission),
    status: response.status,
    body: response.body,
    storedAt: Date.now(),
  })

  await persistIdempotencyRecords()

  return key
}

export async function createQueuedContactMessage(submission: ContactSubmission) {
  const outboxEntry = await enqueueContactOutboxEntry({
    submission,
  })

  logServerEvent("info", "contact.outbox.queued", {
    messageId: outboxEntry.id,
    email: submission.email,
    locale: submission.locale,
  })

  return outboxEntry
}

export async function markContactMessageDelivered(messageId: string, mode: "delivered" | "skipped") {
  await updateContactOutboxEntry(messageId, {
    status: mode,
    lastError: undefined,
  })

  logServerEvent("info", "contact.outbox.completed", {
    messageId,
    mode,
  })
}

export async function markContactMessageFailed(messageId: string, error: string) {
  await updateContactOutboxEntry(messageId, {
    status: "failed",
    lastError: error,
  })

  logServerEvent("error", "contact.outbox.failed", {
    messageId,
    error,
  })
}

export async function processContactOutboxEntries(limit = contactPolicy.outboxReplayBatchSize) {
  const now = Date.now()
  const activeEntries = await reapContactOutboxEntries(now, contactPolicy.outboxRetentionMs)
  const replayableEntries = activeEntries
    .filter((entry) => entry.status === "pending" || entry.status === "failed")
    .sort((left, right) => left.createdAt - right.createdAt)
    .slice(0, limit)

  const summary = {
    scanned: replayableEntries.length,
    delivered: 0,
    skipped: 0,
    failed: 0,
  }

  for (const entry of replayableEntries) {
    await updateContactOutboxEntry(entry.id, {
      attempts: entry.attempts + 1,
      lastAttemptAt: Date.now(),
      lastError: undefined,
    })

    if (!entry.submission) {
      summary.failed += 1
      await markContactMessageFailed(entry.id, "legacy-entry-missing-submission")
      continue
    }

    try {
      const result = await deliverContactMessage(entry.submission)

      if (!result.ok) {
        summary.failed += 1
        await markContactMessageFailed(entry.id, "upstream-delivery-rejected")
        continue
      }

      if (result.skipped) {
        summary.skipped += 1
        await markContactMessageDelivered(entry.id, "skipped")
        continue
      }

      summary.delivered += 1
      await markContactMessageDelivered(entry.id, "delivered")
    } catch (error) {
      summary.failed += 1
      const errorMessage = error instanceof Error ? error.message : "unknown-error"
      await markContactMessageFailed(entry.id, errorMessage)
    }
  }

  return {
    ...summary,
    remaining: (await readContactOutboxEntries()).filter((entry) => entry.status === "pending" || entry.status === "failed").length,
  }
}

export async function runContactOutboxReplay(input: { limit?: number; requestId: string }) {
  const now = Date.now()
  const runtimeState = await readReplayRuntimeState(now)

  if (runtimeState.activeLock) {
    return {
      ok: false as const,
      busy: true as const,
      lock: runtimeState.activeLock,
      replay: null,
    }
  }

  const lock: ReplayLockState = {
    requestId: input.requestId,
    startedAt: now,
    expiresAt: now + contactPolicy.outboxReplayLockMs,
  }

  await writeReplayRuntimeState({
    ...runtimeState,
    activeLock: lock,
  })

  try {
    const replay = await processContactOutboxEntries(input.limit)

    await writeReplayRuntimeState({
      activeLock: null,
      lastCompletedAt: Date.now(),
      lastSummary: replay,
    })

    return {
      ok: true as const,
      busy: false as const,
      lock: null,
      replay,
    }
  } catch (error) {
    await writeReplayRuntimeState({
      ...runtimeState,
      activeLock: null,
    })

    throw error
  }
}

export async function getContactPipelineDiagnostics() {
  await loadIdempotencyRecords(Date.now())
  const replayRuntime = await readReplayRuntimeState(Date.now())

  return {
    outbox: await getContactOutboxDiagnostics(),
    idempotency: {
      size: idempotencyRecords.size,
      windowMs: contactPolicy.idempotencyWindowMs,
    },
    replay: {
      lock: replayRuntime.activeLock,
      lastCompletedAt: replayRuntime.lastCompletedAt,
      lastSummary: replayRuntime.lastSummary,
      lockWindowMs: contactPolicy.outboxReplayLockMs,
    },
  }
}
