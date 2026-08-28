import { getPublicUrl, publicRoutes } from "@/lib/public-routes"
import { siteConfig } from "@/lib/site-config"

export function GET() {
  const links = publicRoutes
    .filter((route) => route.llms)
    .map((route) => `- [${route.path === "/" ? siteConfig.name : route.path.slice(1)}](${getPublicUrl(route, "tr", siteConfig.url)})`)
    .join("\n")
  const body = `# ${siteConfig.name}\n\n${siteConfig.location.en}. Design, brand identity, and web development studio.\n\n## Canonical public pages\n${links}\n\nEnglish equivalents are available under /en.\n`

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } })
}
