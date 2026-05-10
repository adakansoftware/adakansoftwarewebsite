import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

export default function Home() {
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
