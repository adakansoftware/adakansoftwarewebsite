import { siteConfig } from "@/lib/site-config"

const publicRoutes = ["/", "/services", "/projects", "/logo", "/pricing", "/about", "/approach", "/contact", "/blog"]

export function GET() {
  const links = publicRoutes.map((path) => `- [${path === "/" ? siteConfig.name : path.slice(1)}](${siteConfig.url}${path})`).join("\n")
  const body = `# ${siteConfig.name}\n\n${siteConfig.location.en}. Design, brand identity, and web development studio.\n\n## Public pages\n${links}\n`

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } })
}
