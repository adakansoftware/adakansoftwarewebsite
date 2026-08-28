import type { Locale } from "@/lib/i18n"
import { getPublicRouteByPath, getPublicUrl } from "@/lib/public-routes"
import { routeMetadataContent } from "@/lib/route-metadata-content"
import { siteConfig } from "@/lib/site-config"
import { createBreadcrumbSchema, createServiceSchema, createWebPageSchema } from "@/lib/structured-data"

export function PageJsonLd({ locale, path }: { locale: Locale; path: string }) {
  const route = getPublicRouteByPath(path)

  if (!route) return null

  const content = routeMetadataContent[route.metadataKey][locale]
  const url = getPublicUrl(route, locale, siteConfig.url)
  const schemas = [
    createWebPageSchema({ route, locale, url, content }),
    createBreadcrumbSchema({ route, locale, url, pageName: content.title }),
    ...(route.metadataKey === "services" ? [createServiceSchema({ locale, url })] : []),
  ]

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
}
