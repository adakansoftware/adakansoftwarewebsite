import { randomUUID } from "node:crypto"
import { join } from "node:path"

import { readJsonFile, writeJsonFile } from "@/lib/server/json-file-store"

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

const OUTBOX_FILE_PATH = join(process.cwd(), ".data", "contact-outbox.json")

async function readOutboxEntries() {
  return readJsonFile<ContactOutboxEntry[]>(OUTBOX_FILE_PATH, [])
}

async function writeOutboxEntries(entries: ContactOutboxEntry[]) {
  await writeJsonFile(OUTBOX_FILE_PATH, entries)
}

export async function enqueueContactOutboxEntry(input: { email: string; locale: string }) {
  const now = Date.now()
  const entry: ContactOutboxEntry = {
    id: randomUUID(),
    email: input.email,
    locale: input.locale,
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
  status: OutboxStatus,
  lastError?: string,
) {
  const entries = await readOutboxEntries()
  const index = entries.findIndex((entry) => entry.id === id)

  if (index === -1) {
    return null
  }

  const nextEntry: ContactOutboxEntry = {
    ...entries[index],
    status,
    updatedAt: Date.now(),
    lastError,
  }

  entries[index] = nextEntry
  await writeOutboxEntries(entries)
  return nextEntry
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

  return {
    size: entries.length,
    counts,
    recent: entries.slice(-5).reverse(),
  }
}
