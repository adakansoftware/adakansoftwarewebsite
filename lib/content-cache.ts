import type { ContentKind } from "@/lib/admin-content"

export function getManagedContentCacheTag(kind: ContentKind) {
  return `managed-content:${kind}`
}
