"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import { getServices } from "@/lib/site-data"

type Service = ReturnType<typeof getServices>[number]

const copy = {
  tr: {
    eyebrow: "Hizmetlerimiz",
    title: "Net hedef,",
    gradient: "ölçülebilir etki",
    description: "Güzel görünen işler yapmanın ötesine geçiyoruz: konumlandırma, deneyim ve teknik uygulama aynı hedefe bağlanıyor.",
  },
  en: {
    eyebrow: "Services",
    title: "Clear goals,",
    gradient: "measurable impact",
    description: "We go beyond good-looking work: positioning, experience, and technical execution all connect to the same business goal.",
  },
} satisfies Record<Locale, { eyebrow: string; title: string; gradient: string; description: string }>

export function ServicesSection({ locale = "tr" }: { locale?: Locale }) {
  const services = getServices(locale)
  const sectionCopy = copy[locale]
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const contentY = useTransform(scrollYProgress, [0, 1], [56, -18])

  return (
    <section ref={containerRef} id="services" className="relative py-20 md:py-32">
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 grid-pattern opacity-20" />

      <motion.div style={{ y: contentY }} className="container relative z-10 mx-auto px-6">
        <div className="mb-12 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.span initial={false} className="mb-6 block text-sm font-medium tracking-widest text-primary uppercase">
              {sectionCopy.eyebrow}
            </motion.span>

            <motion.h2 initial={false} className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              {sectionCopy.title}
              <br />
              <span className="text-gradient">{sectionCopy.gradient}</span>
            </motion.h2>
          </div>

          <motion.p initial={false} className="max-w-md text-lg leading-relaxed text-muted-foreground">
            {sectionCopy.description}
          </motion.p>
        </div>

        <div className="space-y-2">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div initial={false} className="group">
      <Link href={service.href} className="relative block border-t border-border/50 py-6 transition-colors duration-300 hover:border-primary/50 md:py-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative grid gap-5 md:grid-cols-12 md:items-center md:gap-6">
          <div className="md:col-span-1">
            <span className="font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary md:text-3xl">{service.title}</h3>
          </div>

          <div className="md:col-span-5">
            <p className="leading-relaxed text-muted-foreground">{service.description}</p>
          </div>

          <div className="flex items-center justify-between gap-4 md:col-span-3">
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/50 opacity-100 transition-all duration-300 group-hover:border-primary/50 md:opacity-0 md:group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
