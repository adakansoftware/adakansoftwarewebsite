function firstForwardedAddress(value: string | null) {
  return value?.split(",")[0]?.trim() || null
}

export function getTrustedClientIp(headers: Headers, environment = process.env.NODE_ENV) {
  // Platform-specific headers are set after the public request reaches the
  // trusted edge. Do not accept a client-supplied X-Forwarded-For in production.
  return (
    firstForwardedAddress(headers.get("x-vercel-forwarded-for"))
    || headers.get("x-real-ip")?.trim()
    || (environment !== "production" ? firstForwardedAddress(headers.get("x-forwarded-for")) : null)
    || "unknown"
  )
}
