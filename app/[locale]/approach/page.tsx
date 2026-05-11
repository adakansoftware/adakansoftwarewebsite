import { ApproachPageContent } from "@/components/page-routes"
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
    title: locale === "tr" ? "Yaklaşımımız" : "Approach",
    description:
      locale === "tr"
        ? "Önce strateji, sonra zanaat. Adakan Software tasarım kararlarını marka, kullanıcı ve sürdürülebilirlik odağında kurar."
        : "Strategy first, craft second. Adakan Software shapes design decisions around brand, user, and long-term sustainability.",
    path: "/approach",
  })
}

export default async function ApproachRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <ApproachPageContent locale={locale} />
}
