import type { MetadataRoute } from "next"

import { getPublicUrl, publicRoutes } from "@/lib/public-routes"
import { siteConfig } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.flatMap((route) => [
    {
      url: getPublicUrl(route, "tr", siteConfig.url),
      alternates: { languages: { "tr-TR": getPublicUrl(route, "tr", siteConfig.url), "en-US": getPublicUrl(route, "en", siteConfig.url), "x-default": getPublicUrl(route, "tr", siteConfig.url) } },
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    },
    {
      url: getPublicUrl(route, "en", siteConfig.url),
      alternates: { languages: { "tr-TR": getPublicUrl(route, "tr", siteConfig.url), "en-US": getPublicUrl(route, "en", siteConfig.url), "x-default": getPublicUrl(route, "tr", siteConfig.url) } },
      changeFrequency: route.changeFrequency,
      priority: Math.max(route.priority - 0.05, 0),
    },
  ])
}
