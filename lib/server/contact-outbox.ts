import { randomUUID } from "node:crypto"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { getContactStateStore, type ContactOutboxEntry } from "@/lib/server/contact-state-store"

type OutboxStatus = ContactOutboxEntry["status"]

function maskEmail(email: string) {
  const [local, domain] = email.split("@")
  return local && domain ? `${local.slice(0, 2)}***@${domain}` : "***"
}

function getStore() {
  return getContactStateStore()
}

export async function readContactOutboxEntries() {
  return getStore().readOutboxEntries()
}

export async function writeContactOutboxEntries(entries: ContactOutboxEntry[]) {
  await getStore().writeOutboxEntries(entries)
}

export async function enqueueContactOutboxEntry(input: {
  submission: ContactSubmission
  initialAttempt?: {
    owner: string
    leaseMs: number
  }
}) {
  const now = Date.now()
  const initialAttempt = input.initialAttempt
  const entry: ContactOutboxEntry = {
    id: randomUUID(),
    email: input.submission.email,
    locale: input.submission.locale,
    submission: input.submission,
    // The request path delivers immediately. Persist its lease with the entry
    // so a concurrently-running replay worker cannot deliver it a second time.
    attempts: initialAttempt ? 1 : 0,
    createdAt: now,
    updatedAt: now,
    ...(initialAttempt
      ? {
          lastAttemptAt: now,
          leaseOwner: initialAttempt.owner,
          leaseExpiresAt: now + initialAttempt.leaseMs,
        }
      : {}),
    status: "pending",
  }

  await getStore().updateOutboxEntries((entries) => [...entries, entry])

  return entry
}

export async function updateContactOutboxEntry(
  id: string,
  updates: Partial<
    Pick<
      ContactOutboxEntry,
      "status" | "lastError" | "attempts" | "lastAttemptAt" | "nextAttemptAt" | "leaseOwner" | "leaseExpiresAt"
    >
  >,
  options?: {
    expectedLeaseOwner?: string
  },
): Promise<ContactOutboxEntry | null> {
  let updatedEntry: ContactOutboxEntry | null = null

  await getStore().updateOutboxEntries((entries) => {
    updatedEntry = null
    const index = entries.findIndex((entry) => entry.id === id)
    if (index === -1) {
      return entries
    }

    if (options?.expectedLeaseOwner && entries[index].leaseOwner !== options.expectedLeaseOwner) {
      return entries
    }

    updatedEntry = {
      ...entries[index],
      ...updates,
      updatedAt: Date.now(),
    }

    return entries.map((entry, entryIndex) => (entryIndex === index ? updatedEntry! : entry))
  })

  return updatedEntry
}

export async function claimReplayableContactOutboxEntries(input: {
  owner: string
  now: number
  limit: number
  leaseMs: number
}) {
  const claimedEntries: ContactOutboxEntry[] = []

  await getStore().updateOutboxEntries((entries) => {
    const sortedEntries = [...entries].sort((left, right) => left.createdAt - right.createdAt)
    const selectedIds = new Set<string>()

    for (const entry of sortedEntries) {
      const leaseActive = Boolean(entry.leaseExpiresAt && entry.leaseExpiresAt > input.now)
      const retryReady = !entry.nextAttemptAt || entry.nextAttemptAt <= input.now
      const replayable = (entry.status === "pending" || entry.status === "failed") && retryReady && !leaseActive

      if (!replayable) {
        continue
      }

      selectedIds.add(entry.id)
      claimedEntries.push({
        ...entry,
        leaseOwner: input.owner,
        leaseExpiresAt: input.now + input.leaseMs,
      })

      if (claimedEntries.length >= input.limit) {
        break
      }
    }

    return entries.map((entry) =>
      selectedIds.has(entry.id)
        ? {
            ...entry,
            leaseOwner: input.owner,
            leaseExpiresAt: input.now + input.leaseMs,
            updatedAt: input.now,
          }
        : entry,
    )
  })

  return claimedEntries
}

export async function reapContactOutboxEntries(now: number, retentionMs: number) {
  let filteredEntries: ContactOutboxEntry[] = []

  await getStore().updateOutboxEntries((entries) => {
    filteredEntries = entries.filter((entry) => now - entry.updatedAt < retentionMs)
    return filteredEntries
  })

  return filteredEntries
}

export async function getContactOutboxDiagnostics() {
  const entries = await getStore().readOutboxEntries()
  const counts: Record<OutboxStatus, number> = {
    pending: 0,
    delivered: 0,
    skipped: 0,
    failed: 0,
    "dead-letter": 0,
  }

  for (const entry of entries) {
    counts[entry.status] += 1
  }

  const now = Date.now()
  const oldestPendingEntry = entries
    .filter((entry) => entry.status === "pending" && (!entry.nextAttemptAt || entry.nextAttemptAt <= now))
    .sort((left, right) => left.createdAt - right.createdAt)[0]
  const oldestFailedEntry = entries
    .filter((entry) => entry.status === "failed" && (!entry.nextAttemptAt || entry.nextAttemptAt <= now))
    .sort((left, right) => left.createdAt - right.createdAt)[0]
  const claimedCount = entries.filter((entry) => entry.leaseExpiresAt && entry.leaseExpiresAt > now).length
  const readyCount = entries.filter(
    (entry) =>
      (entry.status === "pending" || entry.status === "failed") &&
      (!entry.nextAttemptAt || entry.nextAttemptAt <= now) &&
      !(entry.leaseExpiresAt && entry.leaseExpiresAt > now),
  ).length

  return {
    size: entries.length,
    counts,
    claimedCount,
    readyCount,
    oldestPendingAgeMs: oldestPendingEntry ? now - oldestPendingEntry.createdAt : null,
    oldestFailedAgeMs: oldestFailedEntry ? now - oldestFailedEntry.createdAt : null,
    recent: entries.slice(-5).reverse().map(({ submission: _submission, email, ...entry }) => ({
      ...entry,
      email: maskEmail(email),
    })),
  }
}
