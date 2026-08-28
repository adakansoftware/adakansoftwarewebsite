import type { MetadataRoute } from "next"

import type { Locale } from "./i18n"
import type { RouteMetadataKey } from "./route-metadata-content"

export type PublicRoute = {
  path: string
  metadataKey: RouteMetadataKey
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
  llms: boolean
}

export const publicRoutes = [
  { path: "/", metadataKey: "home", changeFrequency: "weekly", priority: 1, llms: true },
  { path: "/about", metadataKey: "about", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/approach", metadataKey: "approach", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/blog", metadataKey: "blog", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/careers", metadataKey: "careers", changeFrequency: "monthly", priority: 0.8, llms: false },
  { path: "/contact", metadataKey: "contact", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/logo", metadataKey: "logo", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/privacy", metadataKey: "privacy", changeFrequency: "yearly", priority: 0.3, llms: false },
  { path: "/pricing", metadataKey: "pricing", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/projects", metadataKey: "projects", changeFrequency: "monthly", priority: 0.8, llms: true },
  { path: "/services", metadataKey: "services", changeFrequency: "monthly", priority: 0.9, llms: true },
  { path: "/terms", metadataKey: "terms", changeFrequency: "yearly", priority: 0.3, llms: false },
  { path: "/testimonials", metadataKey: "testimonials", changeFrequency: "monthly", priority: 0.7, llms: false },
] as const satisfies readonly PublicRoute[]

export function getLocalizedPublicPath(route: PublicRoute, locale: Locale): string {
  return locale === "tr" ? route.path : route.path === "/" ? "/en" : `/en${route.path}`
}

export function getPublicUrl(route: PublicRoute, locale: Locale, baseUrl: string): string {
  return new URL(getLocalizedPublicPath(route, locale), baseUrl).toString()
}

export function getPublicRouteByPath(path: string): PublicRoute | undefined {
  return publicRoutes.find((route) => route.path === path)
}
