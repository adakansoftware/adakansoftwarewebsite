import { join } from "node:path"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { readJsonFile, updateJsonFile, writeJsonFile } from "@/lib/server/json-file-store"

export type ContactOutboxStatus = "pending" | "delivered" | "skipped" | "failed"
export type ContactStateBackend = "file" | "redis" | "postgres"

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
  status: ContactOutboxStatus
  lastError?: string
}

export type ContactIdempotencyRecord = {
  fingerprint: string
  status: number
  body: Record<string, unknown>
  storedAt: number
}

export type ContactReplaySummary = {
  scanned: number
  delivered: number
  skipped: number
  failed: number
  remaining: number
}

export type ContactReplayLockState = {
  requestId: string
  startedAt: number
  expiresAt: number
}

export type ContactReplayRuntimeState = {
  activeLock: ContactReplayLockState | null
  lastCompletedAt: number | null
  lastSummary: ContactReplaySummary | null
}

export type ContactReplayAuditEntry = {
  requestId: string
  actor: string
  reason: string
  clientIp: string
  startedAt: number
  completedAt?: number
  batchSize: number
  outcome: "started" | "busy" | "completed" | "failed"
  replay?: ContactReplaySummary | null
  error?: string
}

export type ContactWorkerRuntimeState = {
  workerId: string | null
  lastHeartbeatAt: number | null
  lastReplayAt: number | null
  lastBatchSize: number | null
  lastOutcome: "idle" | "completed" | "failed" | null
  lastError: string | null
}

export type ContactStateStore = {
  backend: ContactStateBackend
  readOutboxEntries(): Promise<ContactOutboxEntry[]>
  writeOutboxEntries(entries: ContactOutboxEntry[]): Promise<void>
  updateOutboxEntries(
    updater: (entries: ContactOutboxEntry[]) => ContactOutboxEntry[] | Promise<ContactOutboxEntry[]>,
  ): Promise<void>
  readIdempotencyRecords(): Promise<Array<[string, ContactIdempotencyRecord]>>
  writeIdempotencyRecords(records: Array<[string, ContactIdempotencyRecord]>): Promise<void>
  readReplayRuntimeState(): Promise<ContactReplayRuntimeState>
  writeReplayRuntimeState(state: ContactReplayRuntimeState): Promise<void>
  readReplayAuditEntries(): Promise<ContactReplayAuditEntry[]>
  writeReplayAuditEntries(entries: ContactReplayAuditEntry[]): Promise<void>
  readWorkerRuntimeState(): Promise<ContactWorkerRuntimeState>
  writeWorkerRuntimeState(state: ContactWorkerRuntimeState): Promise<void>
}

const DATA_DIRECTORY = join(process.cwd(), ".data")
const OUTBOX_FILE_PATH = join(DATA_DIRECTORY, "contact-outbox.json")
const IDEMPOTENCY_FILE_PATH = join(DATA_DIRECTORY, "contact-idempotency.json")
const REPLAY_RUNTIME_FILE_PATH = join(DATA_DIRECTORY, "contact-replay-runtime.json")
const REPLAY_AUDIT_FILE_PATH = join(DATA_DIRECTORY, "contact-replay-audit.json")
const WORKER_RUNTIME_FILE_PATH = join(DATA_DIRECTORY, "contact-worker-runtime.json")

function getConfiguredContactStateBackend(): ContactStateBackend {
  const configuredBackend = process.env.CONTACT_STATE_BACKEND?.trim().toLowerCase()

  if (!configuredBackend || configuredBackend === "file") {
    return "file"
  }

  if (configuredBackend === "redis" || configuredBackend === "postgres") {
    return configuredBackend
  }

  throw new Error(`Unsupported CONTACT_STATE_BACKEND value: ${configuredBackend}`)
}

function normalizeOutboxEntries(entries: ContactOutboxEntry[]) {
  return entries.map<ContactOutboxEntry>((entry) => ({
    ...entry,
    attempts: entry.attempts ?? 0,
    leaseOwner: entry.leaseOwner,
    leaseExpiresAt: entry.leaseExpiresAt,
  }))
}

const fileContactStateStore: ContactStateStore = {
  backend: "file",
  async readOutboxEntries() {
    const entries = await readJsonFile<ContactOutboxEntry[]>(OUTBOX_FILE_PATH, [])
    return normalizeOutboxEntries(entries)
  },
  async writeOutboxEntries(entries) {
    await writeJsonFile(OUTBOX_FILE_PATH, entries)
  },
  async updateOutboxEntries(updater) {
    await updateJsonFile<ContactOutboxEntry[]>(OUTBOX_FILE_PATH, [], async (entries) => updater(normalizeOutboxEntries(entries)))
  },
  async readIdempotencyRecords() {
    return readJsonFile<Array<[string, ContactIdempotencyRecord]>>(IDEMPOTENCY_FILE_PATH, [])
  },
  async writeIdempotencyRecords(records) {
    await writeJsonFile(IDEMPOTENCY_FILE_PATH, records)
  },
  async readReplayRuntimeState() {
    return readJsonFile<ContactReplayRuntimeState>(REPLAY_RUNTIME_FILE_PATH, {
      activeLock: null,
      lastCompletedAt: null,
      lastSummary: null,
    })
  },
  async writeReplayRuntimeState(state) {
    await writeJsonFile(REPLAY_RUNTIME_FILE_PATH, state)
  },
  async readReplayAuditEntries() {
    return readJsonFile<ContactReplayAuditEntry[]>(REPLAY_AUDIT_FILE_PATH, [])
  },
  async writeReplayAuditEntries(entries) {
    await writeJsonFile(REPLAY_AUDIT_FILE_PATH, entries)
  },
  async readWorkerRuntimeState() {
    return readJsonFile<ContactWorkerRuntimeState>(WORKER_RUNTIME_FILE_PATH, {
      workerId: null,
      lastHeartbeatAt: null,
      lastReplayAt: null,
      lastBatchSize: null,
      lastOutcome: null,
      lastError: null,
    })
  },
  async writeWorkerRuntimeState(state) {
    await writeJsonFile(WORKER_RUNTIME_FILE_PATH, state)
  },
}

export function getContactStateStore(): ContactStateStore {
  const backend = getConfiguredContactStateBackend()

  if (backend === "file") {
    return fileContactStateStore
  }

  throw new Error(
    `CONTACT_STATE_BACKEND=${backend} is configured, but the ${backend} ContactStateStore adapter is not implemented yet.`,
  )
}

export function getContactStateStoreCapabilities() {
  const backend = getConfiguredContactStateBackend()

  return {
    backend,
    sharedStoreReady: true,
    distributedStoreConfigured: backend !== "file",
    implementedBackends: ["file"] as const,
    requestedBackendImplemented: backend === "file",
  }
}
