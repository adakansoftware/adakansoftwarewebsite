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
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const headlineStyles = [
    "text-[clamp(2.75rem,9vw,7rem)] font-light text-foreground/68",
    "text-[clamp(4rem,12vw,9rem)] font-bold text-accent font-hero-accent tracking-tight",
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
            <div className="grid gap-8">
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
                  className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <p className="max-w-2xl text-base leading-relaxed text-foreground/72 sm:text-lg md:text-xl">
                    {copy.description}
                  </p>

                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center 2xl:flex-col 2xl:items-stretch">
                    <MagneticButton strength={0.3} className="w-full sm:w-auto 2xl:w-full">
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

                    <MagneticButton strength={0.3} className="w-full sm:w-auto 2xl:w-full">
                      <Button
                        asChild
                        size="lg"
                        variant="ghost"
                        className="w-full rounded-full border border-white/14 bg-white/6 px-8 py-7 text-base font-medium text-foreground/78 hover:bg-white/8 hover:text-foreground"
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
