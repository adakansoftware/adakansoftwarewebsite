import { adminCookie, adminSessionMaxAgeSeconds, cookieName, hasAdminSessionConfiguration } from "@/lib/admin-auth"
import { getAdminSessionMutationRequestError, readAdminLoginCredentials } from "@/lib/admin-session-request"
import { getTrustedClientIp } from "@/lib/server/client-ip"
import { createRequestId, isAllowedOrigin, jsonResponse, optionsResponse } from "@/lib/server/http"
import {
  clearAdminLoginFailures,
  recordAdminLoginFailure,
  shouldRejectAdminLogin,
} from "@/lib/server/admin-login-rate-limit"

const ALLOW_HEADER_VALUE = "POST, OPTIONS"

export function OPTIONS(request: Request) {
  return optionsResponse(createRequestId(request), ALLOW_HEADER_VALUE)
}

export async function POST(request: Request) {
  const requestId = createRequestId(request)
  const requestError = getAdminSessionMutationRequestError(request, isAllowedOrigin)
  if (requestError) {
    return jsonResponse({ ok: false }, { status: requestError, requestId })
  }

  const clientIp = getTrustedClientIp(request.headers)
  const now = Date.now()

  if (await shouldRejectAdminLogin(clientIp, now)) {
    return jsonResponse({ ok: false }, { status: 429, requestId })
  }

  if (!hasAdminSessionConfiguration()) {
    return jsonResponse({ ok: false }, { status: 503, requestId })
  }

  const credentials = await readAdminLoginCredentials(request)
  if (!credentials.ok) {
    await recordAdminLoginFailure(clientIp, now)
    return jsonResponse({ ok: false }, { status: credentials.status, requestId })
  }
  const { email, password } = credentials
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    await recordAdminLoginFailure(clientIp, now)
    return jsonResponse({ ok: false }, { status: 401, requestId })
  }

  await clearAdminLoginFailures(clientIp)
  const response = jsonResponse({ ok: true, email }, { requestId })
  response.cookies.set(cookieName, adminCookie(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: adminSessionMaxAgeSeconds })
  return response
}
