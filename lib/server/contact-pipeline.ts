import { createHash } from "node:crypto"

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
import {
  getContactStateStore,
  type ContactIdempotencyRecord,
  type ContactReplayAuditEntry,
  type ContactReplayLockState,
  type ContactReplayRuntimeState,
} from "@/lib/server/contact-state-store"
import { logServerEvent } from "@/lib/server/logger"

const idempotencyRecords = new Map<string, ContactIdempotencyRecord>()
const contactStateStore = getContactStateStore()

let idempotencyLoaded = false

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

  const storedRecords = await contactStateStore.readIdempotencyRecords()
  for (const [key, record] of storedRecords) {
    idempotencyRecords.set(key, record)
  }

  pruneIdempotencyRecords(now)
  idempotencyLoaded = true
}

function persistIdempotencyRecords() {
  return contactStateStore.writeIdempotencyRecords(Array.from(idempotencyRecords.entries()))
}

async function readReplayRuntimeState(now = Date.now()) {
  const state = await contactStateStore.readReplayRuntimeState()

  if (state.activeLock && state.activeLock.expiresAt <= now) {
    return {
      ...state,
      activeLock: null,
    } satisfies ContactReplayRuntimeState
  }

  return state
}

function writeReplayRuntimeState(state: ContactReplayRuntimeState) {
  return contactStateStore.writeReplayRuntimeState(state)
}

function getRetryDelayMs(attempts: number) {
  const exponentialDelay = contactPolicy.outboxRetryBaseDelayMs * 2 ** Math.max(0, attempts - 1)
  return Math.min(exponentialDelay, contactPolicy.outboxRetryMaxDelayMs)
}

async function readReplayAuditEntries() {
  return contactStateStore.readReplayAuditEntries()
}

function writeReplayAuditEntries(entries: ContactReplayAuditEntry[]) {
  return contactStateStore.writeReplayAuditEntries(entries)
}

async function appendReplayAuditEntry(entry: ContactReplayAuditEntry) {
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

  const lock: ContactReplayLockState = {
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
