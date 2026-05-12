"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDownRight, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/magnetic-button"
import { withLocale, type Locale } from "@/lib/i18n"

const heroCopy = {
  tr: {
    badge: "Mayıs 2026 için yeni proje görüşmeleri açık",
    lines: ["Markanı", "dijitalde", "büyüt"],
    description:
      "Web siteleri, marka kimlikleri ve kullanıcı deneyimleri tasarlıyoruz. Her ekran; güven, hız ve satış için birlikte çalışır.",
    primary: "Projeye Başla",
    secondary: "Projeleri Gör",
    scroll: "Kaydır",
    proofPoints: ["Strateji", "Web tasarım", "Marka kimliği", "Ürün arayüzü"],
  },
  en: {
    badge: "Now booking new projects for May 2026",
    lines: ["Grow", "digital", "brands"],
    description: "We design websites, brand identities, and user experiences. Every screen works together for trust, speed, and conversion.",
    primary: "Start a Project",
    secondary: "View Projects",
    scroll: "Scroll",
    proofPoints: ["Strategy", "Web design", "Brand identity", "Product UI"],
  },
} satisfies Record<
  Locale,
  {
    badge: string
    lines: [string, string, string]
    description: string
    primary: string
    secondary: string
    scroll: string
    proofPoints: string[]
  }
>

export function HeroSection({ locale = "tr" }: { locale?: Locale }) {
  const copy = heroCopy[locale]
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const animationProps = { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
  const animationTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <section
      ref={containerRef}
      className="relative isolate flex min-h-[auto] max-w-full items-start justify-center overflow-hidden px-0 pb-14 pt-24 md:min-h-[100svh] md:items-center md:py-0"
    >
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
            <span className="min-w-0 text-center text-xs tracking-wide text-muted-foreground sm:text-sm">{copy.badge}</span>
          </div>
        </motion.div>

        <div className="mb-8 text-center md:mb-16">
          {copy.lines.map((line, index) => (
            <div key={line} className="mb-2 overflow-visible last:mb-0 sm:mb-4">
              <motion.h1
                initial={false}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`mx-auto max-w-full break-words text-[4rem] leading-[0.94] font-bold tracking-tighter min-[390px]:text-[4.25rem] sm:text-[clamp(3.5rem,10vw,9rem)] ${
                  index === 1 ? "text-gradient" : "text-foreground"
                }`}
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
                className="group w-full rounded-full bg-foreground px-8 py-7 text-base font-medium text-background transition-colors duration-300 hover:bg-foreground/90 hover:shadow-xl hover:shadow-foreground/10 sm:w-auto"
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
          className="mx-auto mt-8 grid w-full max-w-[22rem] grid-cols-2 gap-3 sm:mt-16 sm:max-w-none sm:flex sm:flex-wrap sm:justify-center"
        >
          {copy.proofPoints.map((point) => (
            <span key={point} className="rounded-full border border-border/50 bg-card/25 px-4 py-2 text-center text-sm text-muted-foreground backdrop-blur-md">
              {point}
            </span>
          ))}
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
  )
}
