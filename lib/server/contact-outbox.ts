import { randomUUID } from "node:crypto"
import { join } from "node:path"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { readJsonFile, updateJsonFile, writeJsonFile } from "@/lib/server/json-file-store"

type OutboxStatus = "pending" | "delivered" | "skipped" | "failed"

export type ContactOutboxEntry = {
  id: string
  email: string
  locale: string
  submission?: ContactSubmission
  attempts: number
  createdAt: number
  updatedAt: number
  lastAttemptAt?: number
  nextAttemptAt?: number
  leaseOwner?: string
  leaseExpiresAt?: number
  status: OutboxStatus
  lastError?: string
}

const OUTBOX_FILE_PATH = join(process.cwd(), ".data", "contact-outbox.json")

async function readOutboxEntries() {
  const entries = await readJsonFile<ContactOutboxEntry[]>(OUTBOX_FILE_PATH, [])

  return entries.map<ContactOutboxEntry>((entry) => ({
    ...entry,
    attempts: entry.attempts ?? 0,
    leaseOwner: entry.leaseOwner,
    leaseExpiresAt: entry.leaseExpiresAt,
  }))
}

async function writeOutboxEntries(entries: ContactOutboxEntry[]) {
  await writeJsonFile(OUTBOX_FILE_PATH, entries)
}

export async function readContactOutboxEntries() {
  return readOutboxEntries()
}

export async function writeContactOutboxEntries(entries: ContactOutboxEntry[]) {
  await writeOutboxEntries(entries)
}

export async function enqueueContactOutboxEntry(input: { submission: ContactSubmission }) {
  const now = Date.now()
  const entry: ContactOutboxEntry = {
    id: randomUUID(),
    email: input.submission.email,
    locale: input.submission.locale,
    submission: input.submission,
    attempts: 0,
    createdAt: now,
    updatedAt: now,
    status: "pending",
  }

  const entries = await readOutboxEntries()
  entries.push(entry)
  await writeOutboxEntries(entries)

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
) {
  const entries = await readOutboxEntries()
  const index = entries.findIndex((entry) => entry.id === id)

  if (index === -1) {
    return null
  }

  const nextEntry: ContactOutboxEntry = {
    ...entries[index],
    ...updates,
    updatedAt: Date.now(),
  }

  entries[index] = nextEntry
  await writeOutboxEntries(entries)
  return nextEntry
}

export async function claimReplayableContactOutboxEntries(input: {
  owner: string
  now: number
  limit: number
  leaseMs: number
}) {
  const claimedEntries: ContactOutboxEntry[] = []

  await updateJsonFile<ContactOutboxEntry[]>(OUTBOX_FILE_PATH, [], (entries) => {
    const normalizedEntries = entries.map((entry) => ({
      ...entry,
      attempts: entry.attempts ?? 0,
    }))

    const sortedEntries = [...normalizedEntries].sort((left, right) => left.createdAt - right.createdAt)
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

    return normalizedEntries.map((entry) =>
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
  const entries = await readOutboxEntries()
  const filteredEntries = entries.filter((entry) => now - entry.updatedAt < retentionMs)

  if (filteredEntries.length !== entries.length) {
    await writeOutboxEntries(filteredEntries)
  }

  return filteredEntries
}

export async function getContactOutboxDiagnostics() {
  const entries = await readOutboxEntries()
  const counts: Record<OutboxStatus, number> = {
    pending: 0,
    delivered: 0,
    skipped: 0,
    failed: 0,
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
    recent: entries.slice(-5).reverse(),
  }
}
