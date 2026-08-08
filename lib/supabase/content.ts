import type { Locale } from "@/lib/i18n"
import { getNeonSql } from "@/lib/neon"
import { getLogoWorks, getProjects } from "@/lib/site-data"

type ProjectRow = {
  id: string
  title_tr: string
  title_en: string
  category_tr: string
  category_en: string
  description_tr: string
  description_en: string
  year: string
  href: string
  color: string
  cover_image: string | null
}

type LogoWorkRow = {
  id: string
  title_tr: string
  title_en: string
  category_tr: string
  category_en: string
  description_tr: string
  description_en: string
  initials: string
  color: string
  logo_image: string | null
}

export async function getManagedProjects(locale: Locale) {
  if (!process.env.DATABASE_URL) return getProjects(locale)
  let data: ProjectRow[]
  try { data = await getNeonSql().query('select * from projects where published = true and archived = false order by sort_order') as ProjectRow[] } catch { return getProjects(locale) }
  if (!data.length) return getProjects(locale)

  return (data as ProjectRow[]).map((row) => ({
    title: locale === "tr" ? row.title_tr : row.title_en,
    category: locale === "tr" ? row.category_tr : row.category_en,
    description: locale === "tr" ? row.description_tr : row.description_en,
    year: row.year,
    href: row.href,
    color: row.color,
    ...(row.cover_image ? { coverImage: row.cover_image } : {}),
  }))
}

export async function getManagedLogoWorks(locale: Locale) {
  if (!process.env.DATABASE_URL) return getLogoWorks(locale)
  let data: LogoWorkRow[]
  try { data = await getNeonSql().query('select * from logo_works where published = true and archived = false order by sort_order') as LogoWorkRow[] } catch { return getLogoWorks(locale) }
  if (!data.length) return getLogoWorks(locale)

  return (data as LogoWorkRow[]).map((row) => ({
    title: locale === "tr" ? row.title_tr : row.title_en,
    category: locale === "tr" ? row.category_tr : row.category_en,
    description: locale === "tr" ? row.description_tr : row.description_en,
    initials: row.initials,
    color: row.color,
    ...(row.logo_image ? { logoImage: row.logo_image } : {}),
  }))
}
