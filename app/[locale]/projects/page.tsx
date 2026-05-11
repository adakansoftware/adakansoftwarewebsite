import { ProjectsPageContent } from "@/components/page-routes"
import { createPageMetadata } from "@/lib/metadata"
import { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from "@/lib/route-locale"

export function generateStaticParams() {
  return getPrefixedLocaleStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)

  return createPageMetadata({
    locale,
    title: locale === "tr" ? "Projeler" : "Projects",
    description:
      locale === "tr"
        ? "Adakan Software tarafından hazırlanan seçilmiş web tasarım, marka ve dijital ürün projeleri."
        : "Selected web design, brand, and digital product projects crafted by Adakan Software.",
    path: "/projects",
  })
}

export default async function ProjectsRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <ProjectsPageContent locale={locale} />
}
