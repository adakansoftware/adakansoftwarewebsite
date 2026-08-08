import { NextResponse } from "next/server"

import { isAdmin } from "@/lib/admin-auth"
import { isUuid, parseContentKind, parseContentPayload, type ContentKind, type ContentPayload } from "@/lib/admin-content"
import { getNeonSql } from "@/lib/neon"

export async function GET(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const kind = parseContentKind(new URL(request.url).searchParams.get("type"))
  if (!kind) return badRequest("Geçersiz içerik türü.")

  try {
    const data = await getNeonSql().query(`select * from ${tableFor(kind)} order by sort_order, created_at`)
    return NextResponse.json(data)
  } catch {
    return serverError()
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await readBody(request)
  if (!body) return badRequest("Geçersiz istek gövdesi.")
  const kind = parseContentKind(body.type)
  if (!kind) return badRequest("Geçersiz içerik türü.")
  const parsed = parseContentPayload(kind, body)
  if (!parsed.ok) return badRequest(parsed.message)

  try {
    const rows = await getNeonSql().query(insertQuery(kind), valuesFor(kind, parsed.data))
    return NextResponse.json(rows[0], { status: 201 })
  } catch {
    return serverError()
  }
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await readBody(request)
  if (!body) return badRequest("Geçersiz istek gövdesi.")
  const kind = parseContentKind(body.type)
  if (!kind || !isUuid(body.id)) return badRequest("Geçersiz kayıt.")
  const parsed = parseContentPayload(kind, body)
  if (!parsed.ok) return badRequest(parsed.message)

  try {
    const rows = await getNeonSql().query(updateQuery(kind), [...valuesFor(kind, parsed.data), body.id])
    if (!rows[0]) return NextResponse.json({ ok: false, message: "Kayıt bulunamadı." }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch {
    return serverError()
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await readBody(request)
  if (!body) return badRequest("Geçersiz istek gövdesi.")
  const kind = parseContentKind(body.type)
  if (!kind || !isUuid(body.id)) return badRequest("Geçersiz kayıt.")

  try {
    const rows = await getNeonSql().query(`delete from ${tableFor(kind)} where id = $1 returning id`, [body.id])
    if (!rows[0]) return NextResponse.json({ ok: false, message: "Kayıt bulunamadı." }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch {
    return serverError()
  }
}

async function requireAdmin() {
  return (await isAdmin()) ? null : NextResponse.json({ ok: false }, { status: 401 })
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json()
    return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null
  } catch {
    return null
  }
}

function tableFor(kind: ContentKind) {
  return kind === "projects" ? "projects" : "logo_works"
}

function valuesFor(kind: ContentKind, data: ContentPayload) {
  const common = [data.title_tr, data.title_en, data.category_tr, data.category_en, data.description_tr, data.description_en]
  return kind === "projects"
    ? [...common, data.year!, data.href!, data.color, data.cover_image, data.published, data.archived, data.sort_order]
    : [...common, data.initials!, data.color, data.logo_image, data.published, data.archived, data.sort_order]
}

function insertQuery(kind: ContentKind) {
  return kind === "projects"
    ? "insert into projects (title_tr, title_en, category_tr, category_en, description_tr, description_en, year, href, color, cover_image, published, archived, sort_order) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *"
    : "insert into logo_works (title_tr, title_en, category_tr, category_en, description_tr, description_en, initials, color, logo_image, published, archived, sort_order) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *"
}

function updateQuery(kind: ContentKind) {
  return kind === "projects"
    ? "update projects set title_tr = $1, title_en = $2, category_tr = $3, category_en = $4, description_tr = $5, description_en = $6, year = $7, href = $8, color = $9, cover_image = $10, published = $11, archived = $12, sort_order = $13, updated_at = now() where id = $14 returning *"
    : "update logo_works set title_tr = $1, title_en = $2, category_tr = $3, category_en = $4, description_tr = $5, description_en = $6, initials = $7, color = $8, logo_image = $9, published = $10, archived = $11, sort_order = $12, updated_at = now() where id = $13 returning *"
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 })
}

function serverError() {
  return NextResponse.json({ ok: false, message: "İşlem şu anda tamamlanamadı." }, { status: 500 })
}
