export function getAdminSessionMutationRequestError(
  request: Request,
  isAllowedOrigin: (request: Request) => boolean,
) {
  return isAllowedOrigin(request) ? null : 403
}

const adminLoginMaxBodyBytes = 8 * 1024

export async function readAdminLoginCredentials(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    return { ok: false as const, status: 400 as const }
  }

  const rawContentLength = request.headers.get("content-length")
  if (rawContentLength && (!/^\d+$/.test(rawContentLength.trim()) || Number(rawContentLength) > adminLoginMaxBodyBytes)) {
    return { ok: false as const, status: 413 as const }
  }

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > adminLoginMaxBodyBytes) {
    return { ok: false as const, status: 413 as const }
  }

  try {
    const body: unknown = JSON.parse(rawBody)
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false as const, status: 400 as const }
    }

    const { email, password } = body as { email?: unknown; password?: unknown }
    return typeof email === "string" && typeof password === "string"
      ? { ok: true as const, email, password }
      : { ok: false as const, status: 400 as const }
  } catch {
    return { ok: false as const, status: 400 as const }
  }
}
