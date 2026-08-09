export type ContentKind = "projects" | "logo_works"

export type ContentPayload = {
  title_tr: string
  title_en: string
  category_tr: string
  category_en: string
  description_tr: string
  description_en: string
  year?: string
  href?: string
  initials?: string
  color: string
  cover_image: string | null
  logo_image: string | null
  published: boolean
  archived: boolean
  sort_order: number
}

type ParseResult = { ok: true; data: ContentPayload } | { ok: false; message: string }

const requiredTextFields = ["title_tr", "title_en", "category_tr", "category_en", "description_tr", "description_en"] as const

export function parseContentKind(value: unknown): ContentKind | null {
  return value === "projects" || value === "logo_works" ? value : null
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function parseContentPayload(kind: ContentKind, value: unknown): ParseResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, message: "Geçersiz istek gövdesi." }
  const payload = value as Record<string, unknown>
  const text: Record<string, string> = {}

  for (const field of requiredTextFields) {
    const fieldValue = payload[field]
    if (typeof fieldValue !== "string" || !fieldValue.trim()) return { ok: false, message: "Zorunlu alanları doldurun." }
    text[field] = fieldValue.trim()
  }

  const imageField = kind === "projects" ? "cover_image" : "logo_image"
  const image = parseImageUrl(payload[imageField])
  if (image === undefined) return { ok: false, message: "Geçerli bir görsel URL’si girin." }

  if (typeof payload.color !== "string" || !payload.color.trim()) return { ok: false, message: "Geçerli bir renk girin." }
  if (typeof payload.published !== "boolean" || typeof payload.archived !== "boolean") return { ok: false, message: "Yayın durumu geçersiz." }
  const sortOrder = payload.sort_order
  if (!Number.isInteger(sortOrder) || (sortOrder as number) < 0) return { ok: false, message: "Sıra numarası geçersiz." }

  const common = {
    title_tr: text.title_tr,
    title_en: text.title_en,
    category_tr: text.category_tr,
    category_en: text.category_en,
    description_tr: text.description_tr,
    description_en: text.description_en,
    color: payload.color.trim(),
    cover_image: kind === "projects" ? image : null,
    logo_image: kind === "logo_works" ? image : null,
    published: payload.published,
    archived: payload.archived,
    sort_order: sortOrder as number,
  }

  if (kind === "projects") {
    const href = parseProjectHref(payload.href)
    if (typeof payload.year !== "string" || !payload.year.trim() || !href) return { ok: false, message: "Proje yılı ve bağlantısı zorunludur." }
    return { ok: true, data: { ...common, year: payload.year.trim(), href } }
  }

  if (typeof payload.initials !== "string" || !payload.initials.trim()) return { ok: false, message: "Logo inisiyali zorunludur." }
  return { ok: true, data: { ...common, initials: payload.initials.trim() } }
}

export function parseProjectHref(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const href = value.trim()
  if (!href) return undefined
  if (href.startsWith("/") && !href.startsWith("//") && !href.includes("\\")) return href

  try {
    return new URL(href).protocol === "https:" ? href : undefined
  } catch {
    return undefined
  }
}

function parseImageUrl(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === "") return null
  if (typeof value !== "string") return undefined
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.toString() : undefined
  } catch {
    return undefined
  }
}
