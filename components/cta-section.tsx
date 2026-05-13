"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { Button } from "@/components/ui/button"
import { ctaContent } from "@/lib/home-content"
import { withLocale, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

export function CTASection({ locale = "tr" }: { locale?: Locale }) {
  const sectionCopy = ctaContent[locale]

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-conic from-primary/10 via-accent/5 to-primary/10 opacity-50" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-15" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.h2 initial={false} className="mb-8 text-4xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            {sectionCopy.title}
            <br />
            <span className="text-gradient">{sectionCopy.gradient}</span>
          </motion.h2>

          <motion.p initial={false} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:mb-12 md:text-xl">
            {sectionCopy.description}
          </motion.p>

          <motion.div initial={false} className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
            <MagneticButton strength={0.2}>
              <Button asChild size="lg" className="group rounded-full bg-foreground px-10 py-8 text-lg font-medium text-background transition-colors duration-300 hover:bg-foreground/90 hover:shadow-xl hover:shadow-foreground/10">
                <Link href={withLocale("/contact", locale)}>
                  {sectionCopy.cta}
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </Button>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <a
                href={`mailto:${siteConfig.email}?subject=${locale === "tr" ? "Yeni%20proje%20g%C3%B6r%C3%BC%C5%9Fmesi" : "New%20project%20inquiry"}`}
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {siteConfig.email}
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div initial={false} className="mt-14 grid grid-cols-2 gap-6 border-t border-border/30 pt-10 md:mt-20 md:grid-cols-4 md:gap-8 md:pt-12">
            {sectionCopy.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
                className="text-center"
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
