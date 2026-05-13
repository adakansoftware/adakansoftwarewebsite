import { CTASection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { ProjectsSection } from "@/components/projects-section"
import { ServicesSection } from "@/components/services-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("home", "tr", "/")

export default function HomePage() {
  return (
    <>
      <HeroSection locale="tr" />
      <ServicesSection locale="tr" />
      <PhilosophySection locale="tr" />
      <ProjectsSection locale="tr" />
      <TestimonialsSection locale="tr" />
      <CTASection locale="tr" />
    </>
  )
}
