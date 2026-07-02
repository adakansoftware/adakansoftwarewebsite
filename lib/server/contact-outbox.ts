import { randomUUID } from "node:crypto"
import { join } from "node:path"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-file-store"

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
  status: OutboxStatus
  lastError?: string
}

const OUTBOX_FILE_PATH = join(process.cwd(), ".data", "contact-outbox.json")

async function readOutboxEntries() {
  const entries = await readJsonFile<ContactOutboxEntry[]>(OUTBOX_FILE_PATH, [])

  return entries.map((entry) => ({
    ...entry,
    attempts: entry.attempts ?? 0,
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
  updates: Partial<Pick<ContactOutboxEntry, "status" | "lastError" | "attempts" | "lastAttemptAt">>,
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
    .filter((entry) => entry.status === "pending")
    .sort((left, right) => left.createdAt - right.createdAt)[0]
  const oldestFailedEntry = entries
    .filter((entry) => entry.status === "failed")
    .sort((left, right) => left.createdAt - right.createdAt)[0]

  return {
    size: entries.length,
    counts,
    oldestPendingAgeMs: oldestPendingEntry ? now - oldestPendingEntry.createdAt : null,
    oldestFailedAgeMs: oldestFailedEntry ? now - oldestFailedEntry.createdAt : null,
    recent: entries.slice(-5).reverse(),
  }
}
