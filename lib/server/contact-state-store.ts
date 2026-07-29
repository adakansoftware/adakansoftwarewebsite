import { join } from "node:path"

import { createClient, type RedisClientType } from "redis"

import type { ContactSubmission } from "@/lib/server/contact-service"
import { readJsonFile, updateJsonFile, writeJsonFile } from "@/lib/server/json-file-store"

export type ContactOutboxStatus = "pending" | "delivered" | "skipped" | "failed" | "dead-letter"
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
  updateIdempotencyRecords(
    updater: (
      records: Array<[string, ContactIdempotencyRecord]>,
    ) => Array<[string, ContactIdempotencyRecord]> | Promise<Array<[string, ContactIdempotencyRecord]>>,
  ): Promise<void>
  readReplayRuntimeState(): Promise<ContactReplayRuntimeState>
  writeReplayRuntimeState(state: ContactReplayRuntimeState): Promise<void>
  updateReplayRuntimeState(
    updater: (
      state: ContactReplayRuntimeState,
    ) => ContactReplayRuntimeState | Promise<ContactReplayRuntimeState>,
  ): Promise<void>
  readReplayAuditEntries(): Promise<ContactReplayAuditEntry[]>
  writeReplayAuditEntries(entries: ContactReplayAuditEntry[]): Promise<void>
  updateReplayAuditEntries(
    updater: (
      entries: ContactReplayAuditEntry[],
    ) => ContactReplayAuditEntry[] | Promise<ContactReplayAuditEntry[]>,
  ): Promise<void>
  readWorkerRuntimeState(): Promise<ContactWorkerRuntimeState>
  writeWorkerRuntimeState(state: ContactWorkerRuntimeState): Promise<void>
  updateWorkerRuntimeState(
    updater: (
      state: ContactWorkerRuntimeState,
    ) => ContactWorkerRuntimeState | Promise<ContactWorkerRuntimeState>,
  ): Promise<void>
  consumeAdminNonce(nonce: string, expiresAt: number): Promise<boolean>
  consumeRateLimit(key: string, windowMs: number, maxRequests: number): Promise<boolean>
  consumeDuplicate(key: string, windowMs: number): Promise<boolean>
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
const ADMIN_NONCES_FILE_PATH = join(DATA_DIRECTORY, "contact-admin-nonces.json")
const RATE_LIMIT_FILE_PATH = join(DATA_DIRECTORY, "contact-rate-limits.json")
const DUPLICATE_FILE_PATH = join(DATA_DIRECTORY, "contact-duplicates.json")

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
  const key = getRedisKey(name)
  // WATCH state is scoped to a Redis connection. A dedicated connection prevents
  // concurrent requests from clearing each other's optimistic transaction state.
  const sharedClient = await getRedisClient()
  const client = sharedClient.duplicate()

  await client.connect()

  try {
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
  } finally {
    await client.quit()
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
  async updateIdempotencyRecords(updater) {
    await updateJsonFile<Array<[string, ContactIdempotencyRecord]>>(IDEMPOTENCY_FILE_PATH, [], updater)
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
  async updateReplayRuntimeState(updater) {
    await updateJsonFile<ContactReplayRuntimeState>(
      REPLAY_RUNTIME_FILE_PATH,
      {
        activeLock: null,
        lastCompletedAt: null,
        lastSummary: null,
      },
      updater,
    )
  },
  async readReplayAuditEntries() {
    return readJsonFile<ContactReplayAuditEntry[]>(REPLAY_AUDIT_FILE_PATH, [])
  },
  async writeReplayAuditEntries(entries) {
    await writeJsonFile(REPLAY_AUDIT_FILE_PATH, entries)
  },
  async updateReplayAuditEntries(updater) {
    await updateJsonFile<ContactReplayAuditEntry[]>(REPLAY_AUDIT_FILE_PATH, [], updater)
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
  async updateWorkerRuntimeState(updater) {
    await updateJsonFile<ContactWorkerRuntimeState>(
      WORKER_RUNTIME_FILE_PATH,
      {
        workerId: null,
        lastHeartbeatAt: null,
        lastReplayAt: null,
        lastBatchSize: null,
        lastOutcome: null,
        lastError: null,
      },
      updater,
    )
  },
  async consumeAdminNonce(nonce, expiresAt) {
    let accepted = false
    await updateJsonFile<Record<string, number>>(ADMIN_NONCES_FILE_PATH, {}, (nonces) => {
      const now = Date.now()
      const active = Object.fromEntries(Object.entries(nonces).filter(([, expiry]) => expiry > now))
      if (active[nonce]) return active
      accepted = true
      return { ...active, [nonce]: expiresAt }
    })
    return accepted
  },
  async consumeRateLimit(key, windowMs, maxRequests) {
    let limited = false
    await updateJsonFile<Record<string, number[]>>(RATE_LIMIT_FILE_PATH, {}, (entries) => {
      const now = Date.now()
      const recent = (entries[key] ?? []).filter((timestamp) => now - timestamp < windowMs)
      recent.push(now)
      limited = recent.length > maxRequests
      return { ...entries, [key]: recent }
    })
    return limited
  },
  async consumeDuplicate(key, windowMs) {
    let duplicate = false
    await updateJsonFile<Record<string, number>>(DUPLICATE_FILE_PATH, {}, (entries) => {
      const now = Date.now()
      const active = Object.fromEntries(Object.entries(entries).filter(([, expiry]) => expiry > now))
      duplicate = Boolean(active[key])
      return duplicate ? active : { ...active, [key]: now + windowMs }
    })
    return duplicate
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
  async updateIdempotencyRecords(updater) {
    await updateRedisJson<Array<[string, ContactIdempotencyRecord]>>("idempotency", [], updater)
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
  async updateReplayRuntimeState(updater) {
    await updateRedisJson<ContactReplayRuntimeState>(
      "replay-runtime",
      {
        activeLock: null,
        lastCompletedAt: null,
        lastSummary: null,
      },
      updater,
    )
  },
  async readReplayAuditEntries() {
    return readRedisJson<ContactReplayAuditEntry[]>("replay-audit", [])
  },
  async writeReplayAuditEntries(entries) {
    await writeRedisJson("replay-audit", entries)
  },
  async updateReplayAuditEntries(updater) {
    await updateRedisJson<ContactReplayAuditEntry[]>("replay-audit", [], updater)
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
  async updateWorkerRuntimeState(updater) {
    await updateRedisJson<ContactWorkerRuntimeState>(
      "worker-runtime",
      {
        workerId: null,
        lastHeartbeatAt: null,
        lastReplayAt: null,
        lastBatchSize: null,
        lastOutcome: null,
        lastError: null,
      },
      updater,
    )
  },
  async consumeAdminNonce(nonce, expiresAt) {
    const client = await getRedisClient()
    const result = await client.set(getRedisKey(`admin-nonce:${nonce}`), "1", { NX: true, PX: Math.max(1, expiresAt - Date.now()) })
    return result === "OK"
  },
  async consumeRateLimit(key, windowMs, maxRequests) {
    const client = await getRedisClient()
    const redisKey = getRedisKey(`rate-limit:${key}`)
    const count = await client.incr(redisKey)
    if (count === 1) await client.pExpire(redisKey, windowMs)
    return count > maxRequests
  },
  async consumeDuplicate(key, windowMs) {
    const client = await getRedisClient()
    const result = await client.set(getRedisKey(`duplicate:${key}`), "1", { NX: true, PX: windowMs })
    return result !== "OK"
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
    sharedStoreReady: backend === "redis",
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
