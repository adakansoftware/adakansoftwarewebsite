import type { MetadataRoute } from "next"

import { buildSitemapEntries, publicRoutes } from "@/lib/public-routes"
import { siteConfig } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(publicRoutes, siteConfig.url)
}
