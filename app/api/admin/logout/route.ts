import { cookieName } from "@/lib/admin-auth"
import { getAdminSessionMutationRequestError } from "@/lib/admin-session-request"
import { createRequestId, isAllowedOrigin, jsonResponse, optionsResponse } from "@/lib/server/http"

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

  const response = jsonResponse({ ok: true }, { requestId })
  response.cookies.set(cookieName, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 })
  return response
}
