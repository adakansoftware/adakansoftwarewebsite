import { randomUUID } from "node:crypto"

type OutboxStatus = "pending" | "delivered" | "skipped" | "failed"

export type ContactOutboxEntry = {
  id: string
  email: string
  locale: string
  createdAt: number
  updatedAt: number
  status: OutboxStatus
  lastError?: string
}

const outbox = new Map<string, ContactOutboxEntry>()

export function enqueueContactOutboxEntry(input: { email: string; locale: string }) {
  const now = Date.now()
  const entry: ContactOutboxEntry = {
    id: randomUUID(),
    email: input.email,
    locale: input.locale,
    createdAt: now,
    updatedAt: now,
    status: "pending",
  }

  outbox.set(entry.id, entry)
  return entry
}

export function updateContactOutboxEntry(
  id: string,
  status: OutboxStatus,
  lastError?: string,
) {
  const entry = outbox.get(id)
  if (!entry) {
    return null
  }

  const nextEntry: ContactOutboxEntry = {
    ...entry,
    status,
    updatedAt: Date.now(),
    lastError,
  }

  outbox.set(id, nextEntry)
  return nextEntry
}

export function getContactOutboxDiagnostics() {
  const counts: Record<OutboxStatus, number> = {
    pending: 0,
    delivered: 0,
    skipped: 0,
    failed: 0,
  }

  for (const entry of outbox.values()) {
    counts[entry.status] += 1
  }

  return {
    size: outbox.size,
    counts,
  }
}
