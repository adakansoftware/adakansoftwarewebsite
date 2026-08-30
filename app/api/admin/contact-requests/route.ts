import { parseContactRequestUpdate, toContactRequest } from "@/lib/admin-contact"
import { isAdmin } from "@/lib/admin-auth"
import { getAdminContentRequestError } from "@/lib/admin-content-request"
import { getNeonSql } from "@/lib/neon"
import { createRequestId, isAllowedOrigin, jsonResponse, optionsResponse } from "@/lib/server/http"

const ALLOW_HEADER_VALUE = "GET, PATCH, OPTIONS"

export function OPTIONS(request: Request) {
  return optionsResponse(createRequestId(request), ALLOW_HEADER_VALUE)
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)
  if (!(await isAdmin())) return jsonResponse({ ok: false }, { status: 401, requestId })

  try {
    const rows = await getNeonSql().query("select * from contact_requests order by created_at desc limit 200")
    return jsonResponse(rows.map(toContactRequest).filter((row): row is NonNullable<typeof row> => row !== null), { requestId })
  } catch {
    return jsonResponse({ ok: false, message: "İletişim talepleri yüklenemedi." }, { status: 500, requestId })
  }
}

export async function PATCH(request: Request) {
  const requestId = createRequestId(request)
  if (!(await isAdmin())) return jsonResponse({ ok: false }, { status: 401, requestId })
  const requestError = getAdminContentRequestError(request, isAllowedOrigin)
  if (requestError) return jsonResponse({ ok: false }, { status: requestError, requestId })

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ ok: false, message: "Geçersiz istek gövdesi." }, { status: 400, requestId })
  }

  const parsed = parseContactRequestUpdate(payload)
  if (!parsed.ok) return jsonResponse(parsed, { status: 400, requestId })

  try {
    const rows = await getNeonSql().query(
      "update contact_requests set status = $1, admin_note = $2, updated_at = now() where id = $3 returning *",
      [parsed.data.status, parsed.data.adminNote, parsed.data.id],
    )
    if (!rows[0]) return jsonResponse({ ok: false, message: "İletişim talebi bulunamadı." }, { status: 404, requestId })
    return jsonResponse(rows[0], { requestId })
  } catch {
    return jsonResponse({ ok: false, message: "İletişim talebi güncellenemedi." }, { status: 500, requestId })
  }
}
