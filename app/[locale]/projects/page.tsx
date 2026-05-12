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
        ? "Web tasar?m?, marka kimli?i ve dijital ?r?n geli?tirme i?lerinin se?ili ?rnekleri."
        : "Selected examples of web design, brand identity, and digital product work.",
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
