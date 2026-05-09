"use client"

import { AnimatedBackground } from "@/components/animated-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <AnimatedBackground />
      <Navbar />
      <main className="relative">
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <PhilosophySection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </SmoothScrollProvider>
  )
}
