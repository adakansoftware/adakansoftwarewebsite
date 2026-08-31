import { siteConfig } from "@/lib/site-config"
import { isOriginAllowed } from "@/lib/server/origin-policy"

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"])

function normalizeConfiguredOrigin(origin: string) {
  try {
    return new URL(origin).origin
  } catch {
    return null
  }
}

export function isAllowedOrigin(request: Request, environment = process.env.NODE_ENV) {
  const configuredOrigins = [siteConfig.url, process.env.NEXT_PUBLIC_SITE_URL]
    .map((value) => (value ? normalizeConfiguredOrigin(value) : null))
    .filter((value): value is string => Boolean(value))

  if (isOriginAllowed(request, configuredOrigins, environment)) return true

  if (environment === "production") return false

  try {
    return LOOPBACK_HOSTS.has(new URL(request.headers.get("origin") ?? "").hostname)
  } catch {
    return false
  }
}
