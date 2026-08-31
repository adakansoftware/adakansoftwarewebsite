export function isOriginAllowed(
  request: Request,
  configuredOrigins: readonly string[],
  environment = process.env.NODE_ENV,
) {
  const originHeader = request.headers.get("origin")
  if (!originHeader) return environment !== "production"

  try {
    return configuredOrigins.includes(new URL(originHeader).origin)
  } catch {
    return false
  }
}
