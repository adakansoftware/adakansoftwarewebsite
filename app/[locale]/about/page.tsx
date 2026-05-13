import { AboutPageContent } from "@/components/page-routes"
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
  return createRouteMetadata("about", locale, "/about")
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <AboutPageContent locale={locale} />
}
