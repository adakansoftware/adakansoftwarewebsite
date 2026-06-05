"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowDownRight, ArrowRight } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { Button } from "@/components/ui/button"
import { heroContent } from "@/lib/home-content"
import { withLocale, type Locale } from "@/lib/i18n"

export function HeroSection({ locale = "tr" }: { locale?: Locale }) {
  const copy = heroContent[locale]
  const now = new Date()
  const monthNames = {
    tr: ["Ocak", "Subat", "Mart", "Nisan", "Mayis", "Haziran", "Temmuz", "Agustos", "Eylul", "Ekim", "Kasim", "Aralik"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  } as const
  const dynamicBadge =
    locale === "tr"
      ? `${monthNames.tr[now.getMonth()]} ${now.getFullYear()} için yeni proje görüşmeleri açık`
      : `Now booking new projects for ${monthNames.en[now.getMonth()]} ${now.getFullYear()}`
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const headlineStyles = [
    "text-[clamp(2.75rem,9vw,7rem)] font-light text-foreground/60",
    "text-[clamp(4rem,12vw,9rem)] font-bold text-accent font-aquire tracking-normal",
    "text-[clamp(3.25rem,10vw,8rem)] font-medium text-foreground",
  ]

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const animationProps = { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
  const animationTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="grain relative">
      <section
        ref={containerRef}
        className="relative isolate flex min-h-[auto] max-w-full items-start justify-center overflow-hidden px-0 pb-14 pt-24 md:min-h-[100svh] md:items-center md:py-0"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 left-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #0066ff 40%, oklch(0.76 0.13 174) 60%, transparent)" }}
        />
      <div className="absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.08) 0%, transparent 70%)" }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6">
        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.3 }}
          className="mb-8 flex justify-center md:mb-12"
        >
          <div className="inline-flex w-full max-w-[22rem] items-center justify-center gap-3 rounded-full border border-border/50 bg-card/30 px-4 py-2.5 backdrop-blur-sm sm:w-auto sm:max-w-full sm:px-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="min-w-0 text-center text-xs tracking-wide text-muted-foreground sm:text-sm">{dynamicBadge}</span>
          </div>
        </motion.div>

        <div className="mb-8 text-center md:mb-16">
          {copy.lines.map((line, index) => (
            <div key={line} className="mb-2 overflow-visible last:mb-0 sm:mb-4">
              <motion.h1
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`mx-auto max-w-full break-words leading-[0.94] tracking-tighter ${
                  index === 1 ? "text-shimmer animate-shimmer" : ""
                } ${headlineStyles[index]}`}
              >
                {line}
              </motion.h1>
            </div>
          ))}
        </div>

        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.6 }}
          className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 lg:flex-row lg:gap-12"
        >
          <p className="mx-auto w-full max-w-[22rem] text-center text-base leading-relaxed text-muted-foreground sm:max-w-md sm:text-lg md:text-xl lg:mx-0 lg:text-left">
            {copy.description}
          </p>

          <div className="mx-auto flex w-full max-w-[22rem] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-6 lg:mx-0">
            <MagneticButton strength={0.3} className="w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="group w-full rounded-full bg-accent px-8 py-7 text-base font-medium text-accent-foreground transition-colors duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 sm:w-auto"
              >
                <Link href={withLocale("/contact", locale)}>
                  {copy.primary}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>

            <MagneticButton strength={0.3} className="w-full sm:w-auto">
              <Button asChild size="lg" variant="ghost" className="w-full rounded-full px-8 py-7 text-base font-medium text-muted-foreground hover:text-foreground sm:w-auto">
                <Link href={withLocale("/projects", locale)}>{copy.secondary}</Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.75 }}
          className="stagger mx-auto mt-8 grid w-full max-w-[22rem] grid-cols-2 gap-3 sm:mt-16 sm:max-w-none sm:flex sm:flex-wrap sm:justify-center"
        >
          {copy.proofPoints.map((point) => (
            <span key={point} className="rounded-full border border-border/50 bg-card/25 px-4 py-2 text-center text-sm text-muted-foreground backdrop-blur-md">
              {point}
            </span>
          ))}
        </motion.div>

        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.85 }}
          className="mx-auto mt-6 grid w-full max-w-[22rem] overflow-hidden rounded-2xl border border-border/45 bg-background/55 backdrop-blur-md sm:mt-8 sm:max-w-3xl sm:grid-cols-3"
        >
          {copy.signals.map((signal) => (
            <div key={signal.label} className="border-b border-border/35 px-5 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
              <p className="text-lg font-semibold tracking-tight text-foreground">{signal.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{signal.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.95 }}
          className="mx-auto mt-4 flex w-full max-w-[22rem] flex-col gap-4 rounded-2xl border border-border/35 bg-card/20 p-4 text-left shadow-2xl shadow-background/20 backdrop-blur-xl sm:mt-5 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium tracking-widest text-accent uppercase">{copy.operationalSignals.eyebrow}</span>
              <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[0.7rem] font-medium text-accent">
                {copy.operationalSignals.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {copy.operationalSignals.items.map((item) => (
                <span key={item} className="rounded-full border border-border/35 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:w-32">
            <motion.span
              className="h-1.5 rounded-full bg-accent"
              animate={prefersReducedMotion ? {} : { opacity: [1, 0.45, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="h-1.5 rounded-full bg-accent"
              animate={prefersReducedMotion ? {} : { opacity: [1, 0.45, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
            />
            <span className="h-1.5 rounded-full bg-foreground/35" />
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
          <div className="absolute left-[10%] top-[15%] h-20 w-20 animate-float-slow rounded-2xl border border-primary/20" />
          <div className="absolute bottom-[25%] right-[15%] h-14 w-14 animate-float-slower rounded-full border border-accent/30" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-4 md:flex"
      >
        <span className="text-xs tracking-widest text-muted-foreground uppercase">{copy.scroll}</span>
        <div className="animate-bounce-slow">
          <ArrowDownRight className="h-5 w-5 rotate-45 text-muted-foreground" />
        </div>
      </motion.div>
      </section>
    </div>
  )
}
