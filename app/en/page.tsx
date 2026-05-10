import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

export default function EnglishHomePage() {
  return (
    <>
      <HeroSection locale="en" />
      <ServicesSection locale="en" />
      <PhilosophySection locale="en" />
      <ProjectsSection locale="en" />
      <TestimonialsSection locale="en" />
      <CTASection locale="en" />
    </>
  )
}
