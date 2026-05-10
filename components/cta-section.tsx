"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/magnetic-button"
import { getLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n"

const copy = {
  tr: {
    title: "Markanı",
    gradient: "daha güçlü anlatalım",
    description: "Yeni web siteniz, marka kimliğiniz veya dijital ürününüz için net kapsam, doğru öncelik ve güçlü bir uygulama planı çıkaralım.",
    cta: "Görüşmeye Başla",
    stats: [
      { value: "4", label: "Ana hizmet alanı" },
      { value: "2-6", label: "Haftalık teslim planı" },
      { value: "100%", label: "Responsive yaklaşım" },
      { value: "TR/EN", label: "Çift dil hazırlığı" },
    ],
  },
  en: {
    title: "Let's tell",
    gradient: "your brand stronger",
    description: "For your new website, brand identity, or digital product, let's define the scope, priorities, and a strong execution plan.",
    cta: "Start the Conversation",
    stats: [
      { value: "4", label: "Core service areas" },
      { value: "2-6", label: "Week delivery plan" },
      { value: "100%", label: "Responsive approach" },
      { value: "TR/EN", label: "Bilingual readiness" },
    ],
  },
} satisfies Record<Locale, {
  title: string
  gradient: string
  description: string
  cta: string
  stats: Array<{ value: string; label: string }>
}>

export function CTASection() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const sectionCopy = copy[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section ref={containerRef} className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-conic from-primary/10 via-accent/5 to-primary/10 opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-15" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div style={prefersReducedMotion ? {} : { y }} className="mx-auto max-w-5xl text-center">
          <motion.h2
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-4xl font-bold tracking-tight md:text-7xl lg:text-8xl"
          >
            {sectionCopy.title}
            <br />
            <span className="text-gradient">{sectionCopy.gradient}</span>
          </motion.h2>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:mb-12 md:text-xl"
          >
            {sectionCopy.description}
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6"
          >
            <MagneticButton strength={0.2}>
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 group px-10 py-8 text-lg font-medium rounded-full transition-colors duration-300 hover:shadow-xl hover:shadow-foreground/10">
                <Link href={withLocale("/contact", locale)}>
                  {sectionCopy.cta}
                  <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </Button>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <a href={`mailto:merhaba@adakan.com.tr?subject=${locale === "tr" ? "Yeni%20proje%20g%C3%B6r%C3%BC%C5%9Fmesi" : "New%20project%20inquiry"}`} className="text-muted-foreground hover:text-foreground transition-colors text-lg font-medium">
                merhaba@adakan.com.tr
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 grid grid-cols-2 gap-6 border-t border-border/30 pt-10 md:mt-20 md:grid-cols-4 md:gap-8 md:pt-12"
          >
            {sectionCopy.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
