import { createHash } from "node:crypto"
import { join } from "node:path"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { contactPolicy } from "@/lib/server/contact-policy"
import { enqueueContactOutboxEntry, getContactOutboxDiagnostics, updateContactOutboxEntry } from "@/lib/server/contact-outbox"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-file-store"
import { logServerEvent } from "@/lib/server/logger"

type IdempotencyRecord = {
  fingerprint: string
  status: number
  body: Record<string, unknown>
  storedAt: number
}

const idempotencyRecords = new Map<string, IdempotencyRecord>()
const IDEMPOTENCY_FILE_PATH = join(process.cwd(), ".data", "contact-idempotency.json")

let idempotencyLoaded = false
let idempotencyWriteQueue = Promise.resolve()

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

export async function markContactMessageDelivered(messageId: string, mode: "delivered" | "skipped") {
  await updateContactOutboxEntry(messageId, mode)

  logServerEvent("info", "contact.outbox.completed", {
    messageId,
    mode,
  })
}

export async function markContactMessageFailed(messageId: string, error: string) {
  await updateContactOutboxEntry(messageId, "failed", error)

  logServerEvent("error", "contact.outbox.failed", {
    messageId,
    error,
  })
}

export async function getContactPipelineDiagnostics() {
  await loadIdempotencyRecords(Date.now())

  return {
    outbox: await getContactOutboxDiagnostics(),
    idempotency: {
      size: idempotencyRecords.size,
      windowMs: contactPolicy.idempotencyWindowMs,
    },
  }
}
