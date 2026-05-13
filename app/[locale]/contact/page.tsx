import { ContactPageContent } from "@/components/page-routes"
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
  return createRouteMetadata("contact", locale, "/contact")
}

export default async function ContactRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <ContactPageContent locale={locale} />
}
