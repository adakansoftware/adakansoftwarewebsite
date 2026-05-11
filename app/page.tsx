import { CTASection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { ProjectsSection } from "@/components/projects-section"
import { ServicesSection } from "@/components/services-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Premium Web Tasarımı ve Marka Ajansı",
  description: "Adakan Software; premium web tasarımı, marka kimliği, UI/UX ve dönüşüm odaklı dijital ürün deneyimleri sunan yaratıcı ajans.",
  path: "/",
  keywords: ["premium web tasarımı", "marka ajansı", "ui ux tasarımı", "next.js ajansı"],
})

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
