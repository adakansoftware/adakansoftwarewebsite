import { isAdmin } from "@/lib/admin-auth"
import { createRequestId, jsonResponse, optionsResponse } from "@/lib/server/http"

const ALLOW_HEADER_VALUE = "GET, OPTIONS"

export function OPTIONS(request: Request) {
  return optionsResponse(createRequestId(request), ALLOW_HEADER_VALUE)
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)
  if (!(await isAdmin())) return jsonResponse({ ok: false }, { status: 401, requestId })
  return jsonResponse({ ok: true, email: process.env.ADMIN_EMAIL }, { requestId })
}
