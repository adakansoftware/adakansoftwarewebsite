import { createHash } from "node:crypto"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { contactPolicy } from "@/lib/server/contact-policy"
import { resendContactDelivery } from "@/lib/server/contact-service"
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

function getStore() {
  return getContactStateStore()
}

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

function pruneIdempotencyRecords(records: Map<string, ContactIdempotencyRecord>, now: number) {
  let changed = false

  for (const [key, record] of records.entries()) {
    if (now - record.storedAt >= contactPolicy.idempotencyWindowMs) {
      records.delete(key)
      changed = true
    }
  }

  return changed
}

async function loadIdempotencyRecords(now: number) {
  const records = new Map<string, ContactIdempotencyRecord>(await getStore().readIdempotencyRecords())
  const changed = pruneIdempotencyRecords(records, now)

  if (changed) {
    await getStore().writeIdempotencyRecords(Array.from(records.entries()))
  }

  return records
}

async function readReplayRuntimeState(now = Date.now()) {
  const state = await getStore().readReplayRuntimeState()

  if (state.activeLock && state.activeLock.expiresAt <= now) {
    return {
      ...state,
      activeLock: null,
    } satisfies ContactReplayRuntimeState
  }

  return state
}

function getRetryDelayMs(attempts: number) {
  const exponentialDelay = contactPolicy.outboxRetryBaseDelayMs * 2 ** Math.max(0, attempts - 1)
  return Math.min(exponentialDelay, contactPolicy.outboxRetryMaxDelayMs)
}

async function readReplayAuditEntries() {
  return getStore().readReplayAuditEntries()
}

async function appendReplayAuditEntry(entry: ContactReplayAuditEntry) {
  await getStore().updateReplayAuditEntries((entries) => {
    const nextEntries = [...entries, entry]

    if (nextEntries.length > contactPolicy.replayAuditRetention) {
      nextEntries.splice(0, nextEntries.length - contactPolicy.replayAuditRetention)
    }

    return nextEntries
  })
}

export async function getIdempotencyReplay(request: Request, submission: ContactSubmission, now: number) {
  const key = normalizeIdempotencyKey(request.headers.get("idempotency-key"))
  if (!key) {
    return null
  }

  const idempotencyRecords = await loadIdempotencyRecords(now)

  const existingRecord = idempotencyRecords.get(key)
  if (!existingRecord) {
    const inProgress = await getStore().consumeDuplicate(
      `idempotency:${key}`,
      contactPolicy.idempotencyWindowMs,
    )

    if (inProgress) {
      return { key, conflict: false as const, pending: true as const }
    }

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
    pending: false as const,
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

  const storedAt = Date.now()

  await getStore().updateIdempotencyRecords((storedRecords) => {
    const idempotencyRecords = new Map<string, ContactIdempotencyRecord>(storedRecords)
    pruneIdempotencyRecords(idempotencyRecords, storedAt)
    idempotencyRecords.set(key, {
      fingerprint: getSubmissionFingerprint(submission),
      status: response.status,
      body: response.body,
      storedAt,
    })

    return Array.from(idempotencyRecords.entries())
  })

  return key
}

export async function createQueuedContactMessage(
  submission: ContactSubmission,
  initialAttempt?: { owner: string },
) {
  const outboxEntry = await enqueueContactOutboxEntry({
    submission,
    ...(initialAttempt
      ? {
          initialAttempt: {
            owner: initialAttempt.owner,
            // Include persistence overhead after the upstream timeout before a
            // replay worker may reclaim the message.
            leaseMs: contactPolicy.deliveryTimeoutMs + 30_000,
          },
        }
      : {}),
  })

  logServerEvent("info", "contact.outbox.queued", {
    messageId: outboxEntry.id,
    locale: submission.locale,
  })

  return outboxEntry
}

export async function markContactMessageDelivered(
  messageId: string,
  mode: "delivered" | "skipped",
  expectedLeaseOwner?: string,
) {
  const updatedEntry = await updateContactOutboxEntry(messageId, {
    status: mode,
    lastError: undefined,
    nextAttemptAt: undefined,
    leaseOwner: undefined,
    leaseExpiresAt: undefined,
  }, { expectedLeaseOwner })

  if (!updatedEntry) {
    return null
  }

  logServerEvent("info", "contact.outbox.completed", {
    messageId,
    mode,
  })

  return updatedEntry
}

export async function markContactMessageFailed(
  messageId: string,
  error: string,
  nextAttemptAt?: number,
  attempts = 0,
  expectedLeaseOwner?: string,
) {
  const deadLettered = attempts >= contactPolicy.outboxMaxAttempts
  const updatedEntry = await updateContactOutboxEntry(messageId, {
    status: deadLettered ? "dead-letter" : "failed",
    lastError: error,
    nextAttemptAt: deadLettered ? undefined : (nextAttemptAt ?? Date.now() + getRetryDelayMs(attempts)),
    leaseOwner: undefined,
    leaseExpiresAt: undefined,
  }, { expectedLeaseOwner })

  if (!updatedEntry) {
    return null
  }

  logServerEvent("error", "contact.outbox.failed", {
    messageId,
    error: deadLettered ? `dead-letter:${error}` : error,
  })

  return updatedEntry
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
    const attemptedEntry = await updateContactOutboxEntry(entry.id, {
      attempts: entry.attempts + 1,
      lastAttemptAt: Date.now(),
      lastError: undefined,
    }, { expectedLeaseOwner: owner })

    // A lease might expire while a previous worker is still unwinding. Do not
    // let that stale worker modify a message another worker now owns.
    if (!attemptedEntry) {
      continue
    }

    if (!entry.submission) {
      summary.failed += 1
      await markContactMessageFailed(entry.id, "legacy-entry-missing-submission", Date.now() + getRetryDelayMs(attemptedEntry.attempts), attemptedEntry.attempts, owner)
      continue
    }

    try {
      const result = await resendContactDelivery.deliver(entry.submission)

      if (!result.ok) {
        summary.failed += 1
        await markContactMessageFailed(entry.id, result.failure ?? "upstream-delivery-rejected", Date.now() + getRetryDelayMs(attemptedEntry.attempts), attemptedEntry.attempts, owner)
        continue
      }

      if (result.skipped) {
        summary.skipped += 1
        await markContactMessageDelivered(entry.id, "skipped", owner)
        continue
      }

      summary.delivered += 1
      await markContactMessageDelivered(entry.id, "delivered", owner)
    } catch (error) {
      summary.failed += 1
      const errorMessage = error instanceof Error ? error.message : "unknown-error"
      await markContactMessageFailed(entry.id, errorMessage, Date.now() + getRetryDelayMs(attemptedEntry.attempts), attemptedEntry.attempts, owner)
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
  // Each delivery can use the configured timeout. Keep the replay lock alive
  // for the full worst-case batch duration so a second worker cannot claim the
  // same queue while the first one is still delivering messages.
  const lockWindowMs = Math.max(
    contactPolicy.outboxReplayLockMs,
    batchSize * contactPolicy.deliveryTimeoutMs + 30_000,
  )
  const lock: ContactReplayLockState = {
    requestId: input.requestId,
    startedAt: now,
    expiresAt: now + lockWindowMs,
  }
  let activeLock: ContactReplayLockState | null = null

  await getStore().updateReplayRuntimeState((state) => {
    const currentLock = state.activeLock && state.activeLock.expiresAt > now ? state.activeLock : null

    if (currentLock) {
      activeLock = currentLock
      return currentLock === state.activeLock ? state : { ...state, activeLock: currentLock }
    }

    return {
      ...state,
      activeLock: lock,
    }
  })

  if (activeLock) {
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
      lock: activeLock,
      replay: null,
    }
  }

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

    await getStore().updateReplayRuntimeState((state) => ({
      ...state,
      activeLock: state.activeLock?.requestId === input.requestId ? null : state.activeLock,
      lastCompletedAt: completedAt,
      lastSummary: replay,
    }))

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
    await getStore().updateReplayRuntimeState((state) => ({
      ...state,
      activeLock: state.activeLock?.requestId === input.requestId ? null : state.activeLock,
    }))

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
  const idempotencyRecords = await loadIdempotencyRecords(Date.now())
  const replayRuntime = await readReplayRuntimeState(Date.now())
  const replayAudit = await readReplayAuditEntries()

  const outbox = await getContactOutboxDiagnostics()
  const alerts = [
    outbox.oldestPendingAgeMs && outbox.oldestPendingAgeMs >= contactPolicy.queueAlertAgeMs ? "pending-queue-aging" : null,
    outbox.oldestFailedAgeMs && outbox.oldestFailedAgeMs >= contactPolicy.queueAlertAgeMs ? "failed-queue-aging" : null,
    outbox.counts["dead-letter"] > 0 ? "dead-letter-entries" : null,
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
