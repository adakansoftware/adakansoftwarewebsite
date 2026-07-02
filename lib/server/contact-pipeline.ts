import { createHash } from "node:crypto"
import { join } from "node:path"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { contactPolicy } from "@/lib/server/contact-policy"
import { deliverContactMessage } from "@/lib/server/contact-service"
import {
  claimReplayableContactOutboxEntries,
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

type ReplayAuditEntry = {
  requestId: string
  actor: string
  reason: string
  clientIp: string
  startedAt: number
  completedAt?: number
  batchSize: number
  outcome: "started" | "busy" | "completed" | "failed"
  replay?: ReplaySummary | null
  error?: string
}

const idempotencyRecords = new Map<string, IdempotencyRecord>()
const IDEMPOTENCY_FILE_PATH = join(process.cwd(), ".data", "contact-idempotency.json")
const REPLAY_RUNTIME_FILE_PATH = join(process.cwd(), ".data", "contact-replay-runtime.json")
const REPLAY_AUDIT_FILE_PATH = join(process.cwd(), ".data", "contact-replay-audit.json")

let idempotencyLoaded = false
let idempotencyWriteQueue = Promise.resolve()
let replayWriteQueue = Promise.resolve()
let replayAuditWriteQueue = Promise.resolve()

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

function getRetryDelayMs(attempts: number) {
  const exponentialDelay = contactPolicy.outboxRetryBaseDelayMs * 2 ** Math.max(0, attempts - 1)
  return Math.min(exponentialDelay, contactPolicy.outboxRetryMaxDelayMs)
}

async function readReplayAuditEntries() {
  return readJsonFile<ReplayAuditEntry[]>(REPLAY_AUDIT_FILE_PATH, [])
}

function writeReplayAuditEntries(entries: ReplayAuditEntry[]) {
  replayAuditWriteQueue = replayAuditWriteQueue.then(() => writeJsonFile(REPLAY_AUDIT_FILE_PATH, entries))
  return replayAuditWriteQueue
}

async function appendReplayAuditEntry(entry: ReplayAuditEntry) {
  const entries = await readReplayAuditEntries()
  entries.push(entry)

  if (entries.length > contactPolicy.replayAuditRetention) {
    entries.splice(0, entries.length - contactPolicy.replayAuditRetention)
  }

  await writeReplayAuditEntries(entries)
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
    nextAttemptAt: undefined,
    leaseOwner: undefined,
    leaseExpiresAt: undefined,
  })

  logServerEvent("info", "contact.outbox.completed", {
    messageId,
    mode,
  })
}

export async function markContactMessageFailed(messageId: string, error: string, nextAttemptAt?: number) {
  await updateContactOutboxEntry(messageId, {
    status: "failed",
    lastError: error,
    nextAttemptAt,
    leaseOwner: undefined,
    leaseExpiresAt: undefined,
  })

  logServerEvent("error", "contact.outbox.failed", {
    messageId,
    error,
  })
}

export async function processContactOutboxEntries(
  limit = contactPolicy.outboxReplayBatchSize,
  owner = `replay:${Date.now()}`,
) {
  const now = Date.now()
  await reapContactOutboxEntries(now, contactPolicy.outboxRetentionMs)
  const replayableEntries = await claimReplayableContactOutboxEntries({
    owner,
    now,
    limit,
    leaseMs: contactPolicy.outboxClaimLeaseMs,
  })

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
      await markContactMessageFailed(entry.id, "legacy-entry-missing-submission", Date.now() + getRetryDelayMs(entry.attempts + 1))
      continue
    }

    try {
      const result = await deliverContactMessage(entry.submission)

      if (!result.ok) {
        summary.failed += 1
        await markContactMessageFailed(entry.id, "upstream-delivery-rejected", Date.now() + getRetryDelayMs(entry.attempts + 1))
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
      await markContactMessageFailed(entry.id, errorMessage, Date.now() + getRetryDelayMs(entry.attempts + 1))
    }
  }

  return {
    ...summary,
    remaining: (await readContactOutboxEntries()).filter((entry) => entry.status === "pending" || entry.status === "failed").length,
  }
}

export async function runContactOutboxReplay(input: {
  limit?: number
  requestId: string
  actor: string
  reason: string
  clientIp: string
}) {
  const now = Date.now()
  const batchSize = input.limit ?? contactPolicy.outboxReplayBatchSize
  const runtimeState = await readReplayRuntimeState(now)

  if (runtimeState.activeLock) {
    await appendReplayAuditEntry({
      requestId: input.requestId,
      actor: input.actor,
      reason: input.reason,
      clientIp: input.clientIp,
      startedAt: now,
      completedAt: now,
      batchSize,
      outcome: "busy",
      replay: null,
    })

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

  await appendReplayAuditEntry({
    requestId: input.requestId,
    actor: input.actor,
    reason: input.reason,
    clientIp: input.clientIp,
    startedAt: now,
    batchSize,
    outcome: "started",
    replay: null,
  })

  try {
    const replay = await processContactOutboxEntries(input.limit, `replay:${input.requestId}`)
    const completedAt = Date.now()

    await writeReplayRuntimeState({
      activeLock: null,
      lastCompletedAt: completedAt,
      lastSummary: replay,
    })

    await appendReplayAuditEntry({
      requestId: input.requestId,
      actor: input.actor,
      reason: input.reason,
      clientIp: input.clientIp,
      startedAt: now,
      completedAt,
      batchSize,
      outcome: "completed",
      replay,
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

    await appendReplayAuditEntry({
      requestId: input.requestId,
      actor: input.actor,
      reason: input.reason,
      clientIp: input.clientIp,
      startedAt: now,
      completedAt: Date.now(),
      batchSize,
      outcome: "failed",
      replay: null,
      error: error instanceof Error ? error.message : "unknown-error",
    })

    throw error
  }
}

export async function getContactPipelineDiagnostics() {
  await loadIdempotencyRecords(Date.now())
  const replayRuntime = await readReplayRuntimeState(Date.now())
  const replayAudit = await readReplayAuditEntries()

  const outbox = await getContactOutboxDiagnostics()
  const alerts = [
    outbox.oldestPendingAgeMs && outbox.oldestPendingAgeMs >= contactPolicy.queueAlertAgeMs ? "pending-queue-aging" : null,
    outbox.oldestFailedAgeMs && outbox.oldestFailedAgeMs >= contactPolicy.queueAlertAgeMs ? "failed-queue-aging" : null,
    outbox.claimedCount > 0 ? "leases-active" : null,
  ].filter((value): value is string => Boolean(value))

  return {
    outbox,
    idempotency: {
      size: idempotencyRecords.size,
      windowMs: contactPolicy.idempotencyWindowMs,
    },
    replay: {
      lock: replayRuntime.activeLock,
      lastCompletedAt: replayRuntime.lastCompletedAt,
      lastSummary: replayRuntime.lastSummary,
      lockWindowMs: contactPolicy.outboxReplayLockMs,
      audit: replayAudit.slice(-10).reverse(),
    },
    alerts,
  }
}
