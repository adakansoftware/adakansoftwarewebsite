import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/site-config"

const routes = [
  "",
  "/about",
  "/approach",
  "/blog",
  "/careers",
  "/contact",
  "/logo",
  "/privacy",
  "/pricing",
  "/projects",
  "/services",
  "/terms",
  "/testimonials",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => [
    {
      url: `${siteConfig.url}${route}`,
      alternates: { languages: { "tr-TR": `${siteConfig.url}${route}`, "en-US": `${siteConfig.url}/en${route}` } },
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.8,
    },
    {
      url: `${siteConfig.url}/en${route}`,
      alternates: { languages: { "tr-TR": `${siteConfig.url}${route}`, "en-US": `${siteConfig.url}/en${route}` } },
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 0.95 : 0.75,
    },
  ])
}
