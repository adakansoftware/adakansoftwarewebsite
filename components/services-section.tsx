"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Code2, Globe, Layout, Palette } from "lucide-react"

import { servicesSectionContent } from "@/lib/home-content"
import type { Locale } from "@/lib/i18n"
import { getServices } from "@/lib/site-data"

type Service = ReturnType<typeof getServices>[number]
const serviceIcons = [Globe, Palette, Layout, Code2]

export function ServicesSection({ locale = "tr" }: { locale?: Locale }) {
  const services = getServices(locale)
  const sectionCopy = servicesSectionContent[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-60px" })
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const contentY = useTransform(scrollYProgress, [0, 1], [56, -18])

  return (
    <section ref={containerRef} id="services" className="relative py-20 md:py-32">
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 grid-pattern opacity-20" />

      <motion.div style={{ y: contentY }} className="section-shell">
        <div className="section-frame px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
          <div ref={headingRef} className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <motion.h2
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={prefersReducedMotion || isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
              >
                {sectionCopy.title}
                <br />
                <span className="text-gradient">{sectionCopy.gradient}</span>
              </motion.h2>
            </div>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={prefersReducedMotion || isHeadingInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
              className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {sectionCopy.description}
            </motion.p>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const prefersReducedMotion = useReducedMotion()
  const [supportsPointerTracking, setSupportsPointerTracking] = useState(false)
  const Icon = serviceIcons[index] ?? Globe

  useEffect(() => {
    if (prefersReducedMotion) {
      setSupportsPointerTracking(false)
      return
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const syncPointerTracking = () => setSupportsPointerTracking(mediaQuery.matches)

    syncPointerTracking()
    mediaQuery.addEventListener("change", syncPointerTracking)

    return () => mediaQuery.removeEventListener("change", syncPointerTracking)
  }, [prefersReducedMotion])

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
      animate={prefersReducedMotion || isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="spotlight group"
      onMouseMove={(e) => {
        if (!supportsPointerTracking) return
        const rect = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
      }}
    >
      <Link
        href={service.href}
        className="panel-sheen relative block overflow-hidden rounded-[1.6rem] border border-white/10 bg-background/35 px-5 py-6 transition-[border-color,transform,background-color] duration-300 ease-out hover:border-accent/35 hover:bg-background/55 md:px-6 md:py-7"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/8 via-accent/4 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 translate-x-[-4px] text-accent opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100" />

        <div className="relative grid gap-5 md:grid-cols-12 md:items-center md:gap-6">
          <div className="flex items-center gap-3 md:col-span-1 md:block">
            <span className="font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-card/40 text-accent transition-colors duration-200 group-hover:border-accent/45 group-hover:bg-accent/10 md:mt-4">
              <Icon className="h-4 w-4" />
            </span>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-accent md:text-3xl">{service.title}</h3>
          </div>

          <div className="md:col-span-5">
            <p className="leading-relaxed text-muted-foreground">{service.description}</p>
          </div>

          <div className="flex items-center justify-between gap-4 md:col-span-3">
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:border-accent/30 group-hover:text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 opacity-100 transition-all duration-300 group-hover:border-accent/50 md:opacity-0 md:group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
