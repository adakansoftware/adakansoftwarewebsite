const API_BURST_WINDOW_MS = 10_000
const API_BURST_MAX_REQUESTS = 30

const requestTimestampsByKey = new Map<string, number[]>()

function pruneOldRequests(now: number) {
  for (const [key, timestamps] of requestTimestampsByKey.entries()) {
    const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < API_BURST_WINDOW_MS)

    if (recentTimestamps.length === 0) {
      requestTimestampsByKey.delete(key)
      continue
    }

    requestTimestampsByKey.set(key, recentTimestamps)
  }
}

export function getProxyRateLimitPolicy() {
  return {
    windowMs: API_BURST_WINDOW_MS,
    maxRequests: API_BURST_MAX_REQUESTS,
  }
}

export function isProxyRateLimited(key: string, now: number) {
  if (requestTimestampsByKey.size > 500) {
    pruneOldRequests(now)
  }

  const recentTimestamps = (requestTimestampsByKey.get(key) ?? []).filter(
    (timestamp) => now - timestamp < API_BURST_WINDOW_MS,
  )

  recentTimestamps.push(now)
  requestTimestampsByKey.set(key, recentTimestamps)

  return recentTimestamps.length > API_BURST_MAX_REQUESTS
}

export function getProxyRateLimitDiagnostics() {
  return {
    trackedKeys: requestTimestampsByKey.size,
    policy: getProxyRateLimitPolicy(),
    scope: "best-effort-per-instance",
    authoritative: false,
  }
}
