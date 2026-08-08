import { CTASection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { LogoWorksSection } from "@/components/logo-works-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { ProjectsSection } from "@/components/projects-section"
import { ServicesSection } from "@/components/services-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { createRouteMetadata } from "@/lib/metadata"
import { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from "@/lib/route-locale"
import { getManagedLogoWorks, getManagedProjects } from "@/lib/supabase/content"

export function generateStaticParams() {
  return getPrefixedLocaleStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return createRouteMetadata("home", locale, "/")
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  const [logoWorks, projects] = await Promise.all([getManagedLogoWorks(locale), getManagedProjects(locale)])

  return (
    <>
      <HeroSection locale={locale} />
      <ServicesSection locale={locale} />
      <PhilosophySection locale={locale} />
      <LogoWorksSection locale={locale} works={logoWorks} />
      <ProjectsSection locale={locale} projects={projects} />
      <TestimonialsSection locale={locale} />
      <CTASection locale={locale} />
    </>
  )
}
