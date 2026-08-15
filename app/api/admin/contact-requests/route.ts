import { NextResponse } from "next/server"

import { parseContactRequestUpdate, toContactRequest } from "@/lib/admin-contact"
import { isAdmin } from "@/lib/admin-auth"
import { getAdminContentRequestError } from "@/lib/admin-content-request"
import { getNeonSql } from "@/lib/neon"
import { isAllowedOrigin } from "@/lib/server/http"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 })

  try {
    const rows = await getNeonSql().query("select * from contact_requests order by created_at desc limit 200")
    return NextResponse.json(rows.map(toContactRequest).filter((row): row is NonNullable<typeof row> => row !== null))
  } catch {
    return NextResponse.json({ ok: false, message: "İletişim talepleri yüklenemedi." }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 })
  const requestError = getAdminContentRequestError(request, isAllowedOrigin)
  if (requestError) return NextResponse.json({ ok: false }, { status: requestError })

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, message: "Geçersiz istek gövdesi." }, { status: 400 })
  }

  const parsed = parseContactRequestUpdate(payload)
  if (!parsed.ok) return NextResponse.json(parsed, { status: 400 })

  try {
    const rows = await getNeonSql().query(
      "update contact_requests set status = $1, admin_note = $2, updated_at = now() where id = $3 returning *",
      [parsed.data.status, parsed.data.adminNote, parsed.data.id],
    )
    if (!rows[0]) return NextResponse.json({ ok: false, message: "İletişim talebi bulunamadı." }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch {
    return NextResponse.json({ ok: false, message: "İletişim talebi güncellenemedi." }, { status: 500 })
  }
}
