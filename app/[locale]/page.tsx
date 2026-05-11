import { createPageMetadata } from "@/lib/metadata"
import { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from "@/lib/route-locale"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

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
    title: locale === "tr" ? "Premium Web Tasarım ve Marka Ajansı" : "Premium Web Design and Brand Agency",
    description:
      locale === "tr"
        ? "Adakan Software; premium web tasarım, marka kimliği, UI/UX ve conversion odaklı dijital ürün deneyimleri sunan yaratıcı ajans."
        : "Adakan Software is a creative agency for premium websites, brand identity, UI/UX, and conversion-focused digital product experiences.",
    path: "/",
    keywords:
      locale === "tr"
        ? ["premium web tasarım", "marka ajansı", "ui ux tasarım", "next.js ajansı"]
        : ["premium web design", "brand agency", "ui ux design", "next.js agency"],
  })
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)

  return (
    <>
      <HeroSection locale={locale} />
      <ServicesSection locale={locale} />
      <PhilosophySection locale={locale} />
      <ProjectsSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <CTASection locale={locale} />
    </>
  )
}
