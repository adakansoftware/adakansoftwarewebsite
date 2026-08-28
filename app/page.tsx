import { CTASection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { LogoWorksSection } from "@/components/logo-works-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { PricingSection } from "@/components/pricing-section"
import { PageJsonLd } from "@/components/page-json-ld"
import { ProjectsSection } from "@/components/projects-section"
import { ServicesSection } from "@/components/services-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { createRouteMetadata } from "@/lib/metadata"
import { getManagedLogoWorks, getManagedProjects } from "@/lib/content"

export const metadata = createRouteMetadata("home", "tr", "/")
export const revalidate = 60

export default async function HomePage() {
  const [logoWorks, projects] = await Promise.all([getManagedLogoWorks("tr"), getManagedProjects("tr")])
  return (
    <>
      <PageJsonLd locale="tr" path="/" />
      <HeroSection locale="tr" />
      <ServicesSection locale="tr" />
      <PricingSection locale="tr" />
      <PhilosophySection locale="tr" />
      <LogoWorksSection locale="tr" works={logoWorks} />
      <ProjectsSection locale="tr" projects={projects} />
      <TestimonialsSection locale="tr" />
      <CTASection locale="tr" />
    </>
  )
}
