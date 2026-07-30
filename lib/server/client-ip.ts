function firstForwardedAddress(value: string | null) {
  return value?.split(",")[0]?.trim() || null
}

export function getTrustedClientIp(headers: Headers, environment = process.env.NODE_ENV) {
  // On the production Vercel deployment, use only the platform-populated
  // header. Generic forwarding headers can otherwise be supplied by a client
  // and would let it bypass an IP-based rate limit.
  if (environment === "production") {
    return firstForwardedAddress(headers.get("x-vercel-forwarded-for")) || "unknown"
  }

  return (
    firstForwardedAddress(headers.get("x-vercel-forwarded-for"))
    || headers.get("x-real-ip")?.trim()
    || firstForwardedAddress(headers.get("x-forwarded-for"))
    || "unknown"
  )
}
