import { buildLlmsText, publicRoutes } from "@/lib/public-routes"
import { siteConfig } from "@/lib/site-config"

export function GET() {
  const body = buildLlmsText({ name: siteConfig.name, location: siteConfig.location.en, baseUrl: siteConfig.url, routes: publicRoutes })

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } })
}
