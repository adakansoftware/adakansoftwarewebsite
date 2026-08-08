import { createClient } from "@supabase/supabase-js"

import type { Locale } from "@/lib/i18n"
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

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
}

export async function getManagedProjects(locale: Locale) {
  const client = getPublicClient()
  if (!client) return getProjects(locale)

  const { data, error } = await client.from("projects").select("*").eq("published", true).order("sort_order")
  if (error || !data?.length) return getProjects(locale)

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
  const client = getPublicClient()
  if (!client) return getLogoWorks(locale)

  const { data, error } = await client.from("logo_works").select("*").eq("published", true).order("sort_order")
  if (error || !data?.length) return getLogoWorks(locale)

  return (data as LogoWorkRow[]).map((row) => ({
    title: locale === "tr" ? row.title_tr : row.title_en,
    category: locale === "tr" ? row.category_tr : row.category_en,
    description: locale === "tr" ? row.description_tr : row.description_en,
    initials: row.initials,
    color: row.color,
    ...(row.logo_image ? { logoImage: row.logo_image } : {}),
  }))
}
