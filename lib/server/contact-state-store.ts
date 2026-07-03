import { join } from "node:path"

import { createClient, type RedisClientType } from "redis"

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

export type ContactStateStoreCapabilities = {
  backend: ContactStateBackend
  sharedStoreReady: boolean
  distributedStoreConfigured: boolean
  implementedBackends: readonly ["file", "redis"]
  requestedBackendImplemented: boolean
  requestedBackendReady: boolean
  redisUrlConfigured: boolean
}

export type ContactStateStoreStatus = {
  backend: ContactStateBackend
  capabilities: ContactStateStoreCapabilities
  available: boolean
  error: string | null
}

const DATA_DIRECTORY = join(process.cwd(), ".data")
const OUTBOX_FILE_PATH = join(DATA_DIRECTORY, "contact-outbox.json")
const IDEMPOTENCY_FILE_PATH = join(DATA_DIRECTORY, "contact-idempotency.json")
const REPLAY_RUNTIME_FILE_PATH = join(DATA_DIRECTORY, "contact-replay-runtime.json")
const REPLAY_AUDIT_FILE_PATH = join(DATA_DIRECTORY, "contact-replay-audit.json")
const WORKER_RUNTIME_FILE_PATH = join(DATA_DIRECTORY, "contact-worker-runtime.json")

let redisClientPromise: Promise<RedisClientType> | null = null

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

function getRedisUrl() {
  const redisUrl = process.env.REDIS_URL?.trim()
  if (!redisUrl) {
    throw new Error("REDIS_URL is required when CONTACT_STATE_BACKEND=redis")
  }

  return redisUrl
}

function getRedisNamespace() {
  return process.env.CONTACT_STATE_REDIS_PREFIX?.trim() || "contact-state"
}

function getRedisKey(name: string) {
  return `${getRedisNamespace()}:${name}`
}

async function getRedisClient() {
  if (!redisClientPromise) {
    const client = createClient({
      url: getRedisUrl(),
    })

    redisClientPromise = client
      .connect()
      .then(() => client)
      .catch((error) => {
        redisClientPromise = null
        client.destroy()
        throw error
      })
  }

  return redisClientPromise
}

async function readRedisJson<T>(name: string, fallback: T) {
  const client = await getRedisClient()
  const rawValue = await client.get(getRedisKey(name))

  if (!rawValue) {
    return fallback
  }

  return JSON.parse(rawValue) as T
}

async function writeRedisJson(name: string, value: unknown) {
  const client = await getRedisClient()
  await client.set(getRedisKey(name), JSON.stringify(value))
}

async function updateRedisJson<T>(name: string, fallback: T, updater: (value: T) => T | Promise<T>) {
  const client = await getRedisClient()
  const key = getRedisKey(name)

  for (let attempt = 0; attempt < 5; attempt += 1) {
    await client.watch(key)
    const currentRawValue = await client.get(key)
    const currentValue = currentRawValue ? (JSON.parse(currentRawValue) as T) : fallback
    const nextValue = await updater(currentValue)
    const transaction = client.multi()
    transaction.set(key, JSON.stringify(nextValue))
    const result = await transaction.exec()

    if (result !== null) {
      return
    }
  }

  throw new Error(`Redis update conflict for ${key}`)
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

const redisContactStateStore: ContactStateStore = {
  backend: "redis",
  async readOutboxEntries() {
    const entries = await readRedisJson<ContactOutboxEntry[]>("outbox", [])
    return normalizeOutboxEntries(entries)
  },
  async writeOutboxEntries(entries) {
    await writeRedisJson("outbox", entries)
  },
  async updateOutboxEntries(updater) {
    await updateRedisJson<ContactOutboxEntry[]>("outbox", [], async (entries) => updater(normalizeOutboxEntries(entries)))
  },
  async readIdempotencyRecords() {
    return readRedisJson<Array<[string, ContactIdempotencyRecord]>>("idempotency", [])
  },
  async writeIdempotencyRecords(records) {
    await writeRedisJson("idempotency", records)
  },
  async readReplayRuntimeState() {
    return readRedisJson<ContactReplayRuntimeState>("replay-runtime", {
      activeLock: null,
      lastCompletedAt: null,
      lastSummary: null,
    })
  },
  async writeReplayRuntimeState(state) {
    await writeRedisJson("replay-runtime", state)
  },
  async readReplayAuditEntries() {
    return readRedisJson<ContactReplayAuditEntry[]>("replay-audit", [])
  },
  async writeReplayAuditEntries(entries) {
    await writeRedisJson("replay-audit", entries)
  },
  async readWorkerRuntimeState() {
    return readRedisJson<ContactWorkerRuntimeState>("worker-runtime", {
      workerId: null,
      lastHeartbeatAt: null,
      lastReplayAt: null,
      lastBatchSize: null,
      lastOutcome: null,
      lastError: null,
    })
  },
  async writeWorkerRuntimeState(state) {
    await writeRedisJson("worker-runtime", state)
  },
}

export function getContactStateStore(): ContactStateStore {
  const backend = getConfiguredContactStateBackend()

  if (backend === "file") {
    return fileContactStateStore
  }

  if (backend === "redis") {
    return redisContactStateStore
  }

  throw new Error(`CONTACT_STATE_BACKEND=${backend} is configured, but the ${backend} ContactStateStore adapter is not implemented yet.`)
}

export function getContactStateStoreCapabilities() {
  const backend = getConfiguredContactStateBackend()
  const redisUrlConfigured = Boolean(process.env.REDIS_URL?.trim())

  return {
    backend,
    sharedStoreReady: true,
    distributedStoreConfigured: backend !== "file",
    implementedBackends: ["file", "redis"] as const,
    requestedBackendImplemented: backend === "file" || backend === "redis",
    requestedBackendReady: backend !== "redis" || redisUrlConfigured,
    redisUrlConfigured,
  }
}

export async function getContactStateStoreStatus(): Promise<ContactStateStoreStatus> {
  const capabilities = getContactStateStoreCapabilities()

  if (!capabilities.requestedBackendImplemented) {
    return {
      backend: capabilities.backend,
      capabilities,
      available: false,
      error: `${capabilities.backend} backend is not implemented`,
    }
  }

  if (!capabilities.requestedBackendReady) {
    return {
      backend: capabilities.backend,
      capabilities,
      available: false,
      error: "Selected contact state backend is not configured",
    }
  }

  if (capabilities.backend === "file") {
    return {
      backend: capabilities.backend,
      capabilities,
      available: true,
      error: null,
    }
  }

  try {
    const client = await getRedisClient()
    await client.ping()

    return {
      backend: capabilities.backend,
      capabilities,
      available: true,
      error: null,
    }
  } catch (error) {
    return {
      backend: capabilities.backend,
      capabilities,
      available: false,
      error: error instanceof Error ? error.message : "Unknown contact state backend error",
    }
  }
}
