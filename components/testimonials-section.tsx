"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { testimonialsContent } from "@/lib/home-content"
import type { Locale } from "@/lib/i18n"

export function TestimonialsSection({ locale = "tr" }: { locale?: Locale }) {
  const sectionCopy = testimonialsContent[locale]
  const testimonials = sectionCopy.items
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headingRef, { once: true, margin: "-60px" })
  const prefersReducedMotion = useReducedMotion()

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!document.hidden) {
        setDirection(1)
        setCurrent((prev) => (prev + 1) % testimonials.length)
      }
    }, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [testimonials.length])

  const variants = {
    enter: (entryDirection: number) => ({ x: entryDirection > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (entryDirection: number) => ({ x: entryDirection < 0 ? 60 : -60, opacity: 0 }),
  }

  return (
    <section id="testimonials" className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-primary/5 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div ref={headingRef} className="mb-12 text-center md:mb-16">
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            className="mb-6 block text-sm font-medium tracking-widest text-accent uppercase"
          >
            {sectionCopy.eyebrow}
          </motion.span>

          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-bold tracking-tight md:text-6xl"
          >
            {sectionCopy.title}
            <br />
            <span className="text-gradient">{sectionCopy.gradient}</span>
          </motion.h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative flex min-h-[430px] items-center justify-center sm:min-h-[360px] md:min-h-[300px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute w-full text-center"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                    {testimonials[current].company}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent/80" aria-hidden="true">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <Quote className="mx-auto mb-6 h-10 w-10 text-primary/30" />
                <blockquote className="mb-8 text-lg leading-relaxed font-medium text-foreground md:mb-10 md:text-2xl lg:text-3xl">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-primary/20 to-accent/20 ring-2 ring-accent/10 ring-offset-2 ring-offset-background">
                      <span className="text-lg font-bold text-foreground">{testimonials[current].author.charAt(0)}</span>
                    </div>
                    <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white">✓</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{testimonials[current].author}</p>
                  <p className="text-muted-foreground">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/30 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {testimonials[current].company}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-6 text-center text-[11px] text-muted-foreground/50">
            {locale === "tr" ? "* Müşteri gizliliği nedeniyle bazı bilgiler anonimleştirilmiştir." : "* Some details anonymised at client request."}
          </p>

          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/50 transition-colors duration-300 hover:border-accent/50 hover:bg-accent/5"
              aria-label={sectionCopy.prev}
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="mx-4 flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1)
                    setCurrent(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted-foreground"}`}
                  aria-label={sectionCopy.goTo(index)}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/50 transition-colors duration-300 hover:border-accent/50 hover:bg-accent/5"
              aria-label={sectionCopy.next}
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
