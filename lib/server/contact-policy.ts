type ContactPolicy = {
  rateLimitWindowMs: number
  rateLimitMaxRequests: number
  duplicateWindowMs: number
  idempotencyWindowMs: number
  maxContentLength: number
  deliveryTimeoutMs: number
  outboxRetentionMs: number
  outboxReplayBatchSize: number
  outboxReplayLockMs: number
  replayAuditRetention: number
}

function readPositiveInteger(name: string, fallback: number) {
  const rawValue = process.env[name]
  if (!rawValue) {
    return fallback
  }

  const parsed = Number.parseInt(rawValue, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const contactPolicy: ContactPolicy = {
  rateLimitWindowMs: readPositiveInteger("CONTACT_RATE_LIMIT_WINDOW_MS", 60_000),
  rateLimitMaxRequests: readPositiveInteger("CONTACT_RATE_LIMIT_MAX_REQUESTS", 4),
  duplicateWindowMs: readPositiveInteger("CONTACT_DUPLICATE_WINDOW_MS", 10 * 60_000),
  idempotencyWindowMs: readPositiveInteger("CONTACT_IDEMPOTENCY_WINDOW_MS", 10 * 60_000),
  maxContentLength: readPositiveInteger("CONTACT_MAX_CONTENT_LENGTH", 12_000),
  deliveryTimeoutMs: readPositiveInteger("CONTACT_DELIVERY_TIMEOUT_MS", 8_000),
  outboxRetentionMs: readPositiveInteger("CONTACT_OUTBOX_RETENTION_MS", 7 * 24 * 60 * 60_000),
  outboxReplayBatchSize: readPositiveInteger("CONTACT_OUTBOX_REPLAY_BATCH_SIZE", 25),
  outboxReplayLockMs: readPositiveInteger("CONTACT_OUTBOX_REPLAY_LOCK_MS", 30_000),
  replayAuditRetention: readPositiveInteger("CONTACT_REPLAY_AUDIT_RETENTION", 100),
}

export function getContactPolicySnapshot() {
  return {
    rateLimitWindowMs: contactPolicy.rateLimitWindowMs,
    rateLimitMaxRequests: contactPolicy.rateLimitMaxRequests,
    duplicateWindowMs: contactPolicy.duplicateWindowMs,
    idempotencyWindowMs: contactPolicy.idempotencyWindowMs,
    maxContentLength: contactPolicy.maxContentLength,
    deliveryTimeoutMs: contactPolicy.deliveryTimeoutMs,
    outboxRetentionMs: contactPolicy.outboxRetentionMs,
    outboxReplayBatchSize: contactPolicy.outboxReplayBatchSize,
    outboxReplayLockMs: contactPolicy.outboxReplayLockMs,
    replayAuditRetention: contactPolicy.replayAuditRetention,
  }
}
