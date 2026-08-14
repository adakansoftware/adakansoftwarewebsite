import type { ContentKind } from "@/lib/admin-content"

export function getContentRevalidationPaths(kind: ContentKind) {
  const route = kind === "projects" ? "/projects" : "/logo"
  return ["/", "/en", route, `/en${route}`]
}
