export const adminContentMaxBodyBytes = 32 * 1024

export async function readBoundedJsonObject(request: Request, maxBytes: number) {
  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    return { ok: false as const, status: 413 as const }
  }

  try {
    const body: unknown = JSON.parse(rawBody)
    return body && typeof body === "object" && !Array.isArray(body)
      ? { ok: true as const, body: body as Record<string, unknown> }
      : { ok: false as const, status: 400 as const }
  } catch {
    return { ok: false as const, status: 400 as const }
  }
}

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
