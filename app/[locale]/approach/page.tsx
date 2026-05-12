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
    title: locale === "tr" ? "Yakla??m?m?z" : "Approach",
    description:
      locale === "tr"
        ? "?nce strateji, sonra zanaat. Adakan Software tasar?m kararlar?n? marka, kullan?c? ve s?rd?r?lebilirlik oda??nda kurar."
        : "Strategy first, craft second. Adakan Software builds design decisions around brand, users, and long-term sustainability.",
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
