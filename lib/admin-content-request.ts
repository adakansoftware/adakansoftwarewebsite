export const adminContentMaxBodyBytes = 32 * 1024

export function getAdminContentRequestError(request: Request, isAllowedOrigin: (request: Request) => boolean) {
  if (!isAllowedOrigin(request)) return 403

  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) return 400

  const rawContentLength = request.headers.get("content-length")
  const contentLength = rawContentLength && /^\d+$/.test(rawContentLength.trim())
    ? Number(rawContentLength.trim())
    : rawContentLength ? -1 : null
  if (contentLength !== null && (contentLength < 0 || contentLength > adminContentMaxBodyBytes)) {
    return 413
  }

  return null
}
