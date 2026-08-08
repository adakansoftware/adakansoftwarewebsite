"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { withLocale, type Locale } from "@/lib/i18n"
import { getLogoWorks } from "@/lib/site-data"

type LogoWork = ReturnType<typeof getLogoWorks>[number]

export function LogoWorksSection({ locale = "tr" }: { locale?: Locale }) {
  const logoWorks = getLogoWorks(locale).slice(0, 3)
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
      <Link href={withLocale("/logo", locale)} className="group block overflow-hidden rounded-2xl border border-border/50 bg-card/25 p-5 transition-colors hover:border-accent/45 premium-border">
        <div
          className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
          style={{ background: `linear-gradient(135deg, ${work.color}24, transparent 52%, ${work.color}14)` }}
        >
          <div className="absolute inset-0 grid-pattern opacity-15" />
          <div className="absolute inset-6 flex items-center justify-center rounded-2xl border border-white/10 bg-background/35 backdrop-blur-md">
            { work.logoImage ? (
  <Image
    src={work.logoImage}
    alt={`${work.title} logo`}
    width={320}
    height={180}
    className={`h-auto max-h-[72%] w-[82%] object-contain transition-transform duration-300 group-hover:scale-105 ${
      work.title === "Salihoğulları Hafriyat" ? "-translate-y-3" : ""
    }`}
  />
) : (
  <span
    className="font-aquire text-[clamp(3rem,9vw,5rem)] leading-none transition-transform duration-300 group-hover:scale-105"
    style={{ color: work.color }}
  >
    {work.initials}
  </span>
)}
          </div>
          <div className="absolute right-4 bottom-4 h-2 w-16 rounded-full transition-transform duration-300 group-hover:scale-x-110" style={{ backgroundColor: work.color }} />
        </div>
        <p className="text-xs font-medium tracking-widest text-accent uppercase">{work.category}</p>
        <h3 className="mt-3 text-xl font-bold">{work.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{work.description}</p>
      </Link>
    </motion.div>
  )
}
