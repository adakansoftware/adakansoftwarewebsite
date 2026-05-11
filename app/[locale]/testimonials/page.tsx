import { TestimonialsPageContent } from "@/components/page-routes"
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
    title: locale === "tr" ? "Yorumlar" : "Testimonials",
    description:
      locale === "tr"
        ? "Adakan Software ile çalışan iş ortaklarının deneyimlerini ve teslim kalitesi hakkındaki geri bildirimlerini inceleyin."
        : "Read partner feedback on delivery quality, clarity, and working with Adakan Software.",
    path: "/testimonials",
  })
}

export default async function TestimonialsRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <TestimonialsPageContent locale={locale} />
}
