import type { Metadata } from "next"

import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"
import { routeMetadataContent, type RouteMetadataKey } from "@/lib/route-metadata-content"

const siteName = siteConfig.name
const siteUrl = siteConfig.url
const defaultImage = siteConfig.defaultOgImage

const localeMap: Record<Locale, { og: string; alternates: string }> = {
  tr: { og: "tr_TR", alternates: "tr-TR" },
  en: { og: "en_US", alternates: "en-US" },
}

type PageMetadataInput = {
  locale: Locale
  title: string
  description: string
  path: string
  keywords?: string[]
}

export function createPageMetadata({
  locale,
  title,
  description,
  path,
  keywords = [],
}: PageMetadataInput): Metadata {
  const canonicalPath = locale === "tr" ? path : `/en${path === "/" ? "" : path}`
  const canonicalUrl = `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "tr-TR": path,
        "en-US": path === "/" ? "/en" : `/en${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: canonicalUrl,
      siteName,
      locale: localeMap[locale].og,
      type: "website",
      images: [
        {
          url: defaultImage,
          width: 1600,
          height: 1200,
          alt: `${siteName} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [defaultImage],
    },
  }
}

export function createRouteMetadata(route: RouteMetadataKey, locale: Locale, path: string): Metadata {
  const content = routeMetadataContent[route][locale]

  return createPageMetadata({
    locale,
    title: content.title,
    description: content.description,
    path,
    keywords: content.keywords,
  })
}
