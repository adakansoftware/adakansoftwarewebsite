"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/magnetic-button"

const proofPoints = ["Strateji", "Web tasarım", "Marka kimliği", "Ürün arayüzü"]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const animationProps = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }
  const animationTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Static Gradient Background - no animation */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        style={prefersReducedMotion ? {} : { y, opacity }}
        className="container mx-auto px-6 relative z-10"
      >
        {/* Status Badge */}
        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm text-muted-foreground tracking-wide">Mayıs 2026 için yeni proje görüşmeleri açık</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <div className="text-center mb-16">
          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={prefersReducedMotion ? {} : { y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.5rem,12vw,10rem)] font-bold tracking-tighter leading-[0.9] text-foreground"
            >
              Markanı
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={prefersReducedMotion ? {} : { y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.5rem,12vw,10rem)] font-bold tracking-tighter leading-[0.9]"
            >
              <span className="text-gradient">dijitalde</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={prefersReducedMotion ? {} : { y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.5rem,12vw,10rem)] font-bold tracking-tighter leading-[0.9] text-foreground"
            >
              büyüt
            </motion.h1>
          </div>
        </div>

        {/* Subheading & CTA Row */}
        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.6 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-5xl mx-auto"
        >
          <p className="text-lg md:text-xl text-muted-foreground max-w-md text-center lg:text-left leading-relaxed">
            Web siteleri, marka kimlikleri ve kullanıcı deneyimleri tasarlıyoruz. Her ekran; güven, hız ve satış için birlikte çalışır.
          </p>
          
          <div className="flex items-center gap-6">
            <MagneticButton strength={0.3}>
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 group px-8 py-7 text-base font-medium rounded-full transition-colors duration-300 hover:shadow-xl hover:shadow-foreground/10"
              >
                <Link href="/contact">
                  Projeye Başla
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            
            <MagneticButton strength={0.3}>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground px-8 py-7 text-base font-medium rounded-full"
              >
                <Link href="/projects">Projeleri Gör</Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          {...animationProps}
          transition={{ ...animationTransition, delay: 0.75 }}
          className="mt-16 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center"
        >
          {proofPoints.map((point) => (
            <span
              key={point}
              className="rounded-full border border-border/50 bg-card/25 px-4 py-2 text-center text-sm text-muted-foreground backdrop-blur-md"
            >
              {point}
            </span>
          ))}
        </motion.div>

        {/* Simplified Floating Elements - CSS only animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          <div
            className="absolute top-[15%] left-[10%] w-20 h-20 rounded-2xl border border-primary/20 animate-float-slow"
          />
          <div
            className="absolute bottom-[25%] right-[15%] w-14 h-14 rounded-full border border-accent/30 animate-float-slower"
          />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-4 md:flex"
      >
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Kaydır</span>
        <div className="animate-bounce-slow">
          <ArrowDownRight className="w-5 h-5 text-muted-foreground rotate-45" />
        </div>
      </motion.div>
    </section>
  )
}
