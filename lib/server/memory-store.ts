export function pruneExpiredEntries(store: Map<string, number>, now: number, maxAgeMs: number) {
  for (const [key, timestamp] of store.entries()) {
    if (now - timestamp >= maxAgeMs) {
      store.delete(key)
    }
  }
}

export function pruneExpiredBuckets(store: Map<string, number[]>, now: number, maxAgeMs: number) {
  for (const [key, timestamps] of store.entries()) {
    const recent = timestamps.filter((timestamp) => now - timestamp < maxAgeMs)

    if (recent.length === 0) {
      store.delete(key)
      continue
    }

    store.set(key, recent)
  }
}
