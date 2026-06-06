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
    tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  } as const
  const dynamicBadge =
    locale === "tr"
      ? `${monthNames.tr[now.getMonth()]} ${now.getFullYear()} için yeni proje görüşmeleri açık`
      : `Now booking new projects for ${monthNames.en[now.getMonth()]} ${now.getFullYear()}`
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const headlineStyles = [
    "text-[clamp(2.75rem,9vw,7rem)] font-light text-foreground/55",
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
            className="absolute left-[12%] top-[18%] h-[420px] w-[420px] rounded-full opacity-60"
            style={{ background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.14) 0%, transparent 72%)" }}
          />
          <div
            className="absolute bottom-[12%] right-[8%] h-[520px] w-[520px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, oklch(0.58 0.18 255 / 0.11) 0%, transparent 72%)" }}
          />
        </div>

        <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6">
          <div className="section-frame px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
            <motion.div
              {...animationProps}
              transition={{ ...animationTransition, delay: 0.15 }}
              className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="inline-flex max-w-max items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="min-w-0 text-xs tracking-wide text-muted-foreground sm:text-sm">{dynamicBadge}</span>
              </div>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.72fr)] lg:items-end">
              <div>
                <div className="mb-8 text-left">
                  {copy.lines.map((line, index) => (
                    <div key={line} className="mb-2 overflow-visible last:mb-0 sm:mb-3">
                      <motion.h1
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.16 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className={`max-w-full break-words leading-[0.92] tracking-tighter ${
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
                  transition={{ ...animationTransition, delay: 0.42 }}
                  className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                    {copy.description}
                  </p>

                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                    <MagneticButton strength={0.3} className="w-full sm:w-auto lg:w-full">
                      <Button
                        asChild
                        size="lg"
                        className="group w-full rounded-full bg-accent px-8 py-7 text-base font-medium text-accent-foreground transition-colors duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20"
                      >
                        <Link href={withLocale("/contact", locale)}>
                          {copy.primary}
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </MagneticButton>

                    <MagneticButton strength={0.3} className="w-full sm:w-auto lg:w-full">
                      <Button
                        asChild
                        size="lg"
                        variant="ghost"
                        className="w-full rounded-full border border-white/10 bg-white/5 px-8 py-7 text-base font-medium text-muted-foreground hover:bg-white/8 hover:text-foreground"
                      >
                        <Link href={withLocale("/projects", locale)}>{copy.secondary}</Link>
                      </Button>
                    </MagneticButton>
                  </div>
                </motion.div>

                <motion.div
                  {...animationProps}
                  transition={{ ...animationTransition, delay: 0.58 }}
                  className="mt-8 flex flex-wrap gap-2.5"
                >
                  {copy.proofPoints.map((point) => (
                    <span key={point} className="data-chip">
                      {point}
                    </span>
                  ))}
                </motion.div>
              </div>

              <motion.aside
                {...animationProps}
                transition={{ ...animationTransition, delay: 0.52 }}
                className="metric-card"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-medium tracking-[0.24em] text-accent uppercase">
                    {copy.operationalSignals.eyebrow}
                  </span>
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[0.7rem] font-medium text-accent">
                    {copy.operationalSignals.status}
                  </span>
                </div>

                <div className="grid gap-3">
                  {copy.operationalSignals.items.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-foreground/82">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {copy.signals.map((signal) => (
                    <div key={signal.label} className="rounded-2xl border border-white/8 bg-background/40 px-4 py-4">
                      <p className="text-xl font-semibold tracking-tight text-foreground">{signal.value}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{signal.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <motion.span
                    className="h-1.5 flex-1 rounded-full bg-accent"
                    animate={prefersReducedMotion ? {} : { opacity: [1, 0.45, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="h-1.5 flex-1 rounded-full bg-accent/70"
                    animate={prefersReducedMotion ? {} : { opacity: [1, 0.45, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />
                  <span className="h-1.5 flex-1 rounded-full bg-foreground/20" />
                </div>
              </motion.aside>
            </div>
          </div>

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
