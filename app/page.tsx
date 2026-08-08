import { CTASection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { LogoWorksSection } from "@/components/logo-works-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { ProjectsSection } from "@/components/projects-section"
import { ServicesSection } from "@/components/services-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { createRouteMetadata } from "@/lib/metadata"
import { getManagedLogoWorks, getManagedProjects } from "@/lib/supabase/content"

export const metadata = createRouteMetadata("home", "tr", "/")

export default async function HomePage() {
  const [logoWorks, projects] = await Promise.all([getManagedLogoWorks("tr"), getManagedProjects("tr")])
  return (
    <>
      <HeroSection locale="tr" />
      <ServicesSection locale="tr" />
      <PhilosophySection locale="tr" />
      <LogoWorksSection locale="tr" works={logoWorks} />
      <ProjectsSection locale="tr" projects={projects} />
      <TestimonialsSection locale="tr" />
      <CTASection locale="tr" />
    </>
  )
}
