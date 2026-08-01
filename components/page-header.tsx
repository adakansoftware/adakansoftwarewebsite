"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { Button } from "@/components/ui/button"
import { withLocale, type Locale } from "@/lib/i18n"

type PageHeaderProps = {
  locale?: Locale
  title: string
  gradientText?: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export function PageHeader({
  locale = "tr",
  title,
  gradientText,
  description,
  primaryHref = withLocale("/contact", locale),
  primaryLabel = locale === "en" ? "Start a Project" : "Projeye Başla",
  secondaryHref,
  secondaryLabel,
}: PageHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-20px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div ref={ref} className="section-shell">
        <motion.div
          className="max-w-4xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
          animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            {title}
            {gradientText ? (
              <>
                <br />
                <span className="text-gradient">{gradientText}</span>
              </>
            ) : null}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <MagneticButton strength={0.22}>
              <Button
                asChild
                size="lg"
                className="group rounded-full bg-accent px-8 py-7 text-accent-foreground transition-colors duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20"
              >
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </Link>
              </Button>
            </MagneticButton>
            {secondaryHref && secondaryLabel ? (
              <MagneticButton strength={0.18}>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-full px-8 py-7 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              </MagneticButton>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
