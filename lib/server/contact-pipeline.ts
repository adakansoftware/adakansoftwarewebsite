import { createHash } from "node:crypto"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { contactPolicy } from "@/lib/server/contact-policy"
import { enqueueContactOutboxEntry, getContactOutboxDiagnostics, updateContactOutboxEntry } from "@/lib/server/contact-outbox"
import { logServerEvent } from "@/lib/server/logger"

type IdempotencyRecord = {
  fingerprint: string
  status: number
  body: Record<string, unknown>
  storedAt: number
}

const idempotencyRecords = new Map<string, IdempotencyRecord>()

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

export function getIdempotencyReplay(request: Request, submission: ContactSubmission, now: number) {
  const key = normalizeIdempotencyKey(request.headers.get("idempotency-key"))
  if (!key) {
    return null
  }

  if (idempotencyRecords.size > 500) {
    pruneIdempotencyRecords(now)
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

export function storeIdempotencyReplay(
  request: Request,
  submission: ContactSubmission,
  response: { status: number; body: Record<string, unknown> },
) {
  const key = normalizeIdempotencyKey(request.headers.get("idempotency-key"))
  if (!key) {
    return null
  }

  idempotencyRecords.set(key, {
    fingerprint: getSubmissionFingerprint(submission),
    status: response.status,
    body: response.body,
    storedAt: Date.now(),
  })

  return key
}

export function createQueuedContactMessage(submission: ContactSubmission) {
  const outboxEntry = enqueueContactOutboxEntry({
    email: submission.email,
    locale: submission.locale,
  })

  logServerEvent("info", "contact.outbox.queued", {
    messageId: outboxEntry.id,
    email: submission.email,
    locale: submission.locale,
  })

  return outboxEntry
}

export function markContactMessageDelivered(messageId: string, mode: "delivered" | "skipped") {
  updateContactOutboxEntry(messageId, mode)

  logServerEvent("info", "contact.outbox.completed", {
    messageId,
    mode,
  })
}

export function markContactMessageFailed(messageId: string, error: string) {
  updateContactOutboxEntry(messageId, "failed", error)

  logServerEvent("error", "contact.outbox.failed", {
    messageId,
    error,
  })
}

export function getContactPipelineDiagnostics() {
  return {
    outbox: getContactOutboxDiagnostics(),
    idempotency: {
      size: idempotencyRecords.size,
      windowMs: contactPolicy.idempotencyWindowMs,
    },
  }
}
