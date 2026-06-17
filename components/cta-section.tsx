"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { Button } from "@/components/ui/button"
import { ctaContent } from "@/lib/home-content"
import { withLocale, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

export function CTASection({ locale = "tr" }: { locale?: Locale }) {
  const sectionCopy = ctaContent[locale]
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-conic from-primary/10 via-accent/5 to-primary/10 opacity-50" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.58 0.18 255 / 0.07) 0%, transparent 70%)" }} />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-15" />

      <div ref={sectionRef} className="section-shell">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="section-frame mx-auto max-w-5xl px-5 py-8 text-center sm:px-8 lg:px-12 lg:py-12"
        >
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-4xl font-bold tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            {sectionCopy.title}
            <br />
            <span className="text-gradient">{sectionCopy.gradient}</span>
          </motion.h2>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:mb-12 md:text-xl"
          >
            {sectionCopy.description}
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6"
          >
            <MagneticButton strength={0.2}>
              <Button asChild size="lg" className="group rounded-full bg-accent px-10 py-8 text-lg font-medium text-accent-foreground transition-colors duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20">
                <Link href={withLocale("/contact", locale)}>
                  {sectionCopy.cta}
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </Link>
              </Button>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <a
              href={`mailto:${siteConfig.email}?subject=${locale === "tr" ? "Yeni%20proje%20g%C3%B6r%C3%BC%C5%9Fmesi" : "New%20project%20inquiry"}`}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-lg font-medium text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {siteConfig.email}
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-10 md:mt-20 md:grid-cols-4 md:gap-5 md:pt-12"
          >
            {sectionCopy.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.4rem] border border-white/10 bg-background/35 px-4 py-5 text-center"
              >
                <div className="mb-2 text-4xl font-bold text-foreground md:text-5xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
