import type { MetadataRoute } from "next"

const routes = [
  "",
  "/about",
  "/approach",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/projects",
  "/services",
  "/terms",
  "/testimonials",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://adakansoftware.com"
  const now = new Date()

  return routes.flatMap((route) => [
    {
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.8,
    },
    {
      url: `${baseUrl}/en${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 0.95 : 0.75,
    },
  ])
}
