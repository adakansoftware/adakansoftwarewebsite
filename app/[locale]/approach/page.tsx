import { ApproachPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"
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
  return createRouteMetadata("approach", locale, "/approach")
}

export default async function ApproachRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <ApproachPageContent locale={locale} />
}
