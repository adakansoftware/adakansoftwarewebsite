import { CareersPageContent } from "@/components/static-page-routes"
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
    title: locale === "tr" ? "Kariyer" : "Careers",
    description:
      locale === "tr"
        ? "Tasarım, frontend ve marka stratejisi alanlarında Adakan Software ile çalışma kültürünü keşfedin."
        : "Explore how Adakan Software thinks about craft, design, frontend, and future team opportunities.",
    path: "/careers",
  })
}

export default async function CareersRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <CareersPageContent locale={locale} />
}
