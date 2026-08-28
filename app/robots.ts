import type { MetadataRoute } from "next"

import { buildRobotsPolicy } from "@/lib/public-routes"
import { siteConfig } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return buildRobotsPolicy(siteConfig.url)
}
