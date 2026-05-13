import { TestimonialsPageContent } from "@/components/page-routes"
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
  return createRouteMetadata("testimonials", locale, "/testimonials")
}

export default async function TestimonialsRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <TestimonialsPageContent locale={locale} />
}
