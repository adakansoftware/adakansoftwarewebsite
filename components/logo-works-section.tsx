"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { withLocale, type Locale } from "@/lib/i18n"
import { getLogoWorks } from "@/lib/site-data"
import { PortfolioLogoCard, type PortfolioLogoWork } from "@/components/portfolio-logo-card"

type LogoWork = PortfolioLogoWork

export function LogoWorksSection({ locale = "tr", works: managedWorks }: { locale?: Locale; works?: LogoWork[] }) {
  const logoWorks = (managedWorks ?? getLogoWorks(locale)).slice(0, 3)
  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-60px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-10" />
      <div className="section-shell">
        <div ref={headingRef} className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion || isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-bold tracking-tight md:text-6xl"
            >
              {locale === "tr" ? "Marka işaretini" : "Shape the mark"}
              <br />
              <span className="text-gradient">{locale === "tr" ? "sistem gibi kur" : "as a system"}</span>
            </motion.h2>
          </div>
          <Link href={withLocale("/logo", locale)} className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            {locale === "tr" ? "Logo sayfasını gör" : "View logo page"}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {logoWorks.map((work, index) => (
            <LogoWorkCard key={work.title} work={work} index={index} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LogoWorkCard({ work, index, locale }: { work: LogoWork; index: number; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <PortfolioLogoCard work={work} href={withLocale("/logo", locale)} />
    </motion.div>
  )
}
