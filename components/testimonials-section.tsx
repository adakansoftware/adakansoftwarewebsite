"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { testimonialsContent } from "@/lib/home-content"
import type { Locale } from "@/lib/i18n"

export function TestimonialsSection({ locale = "tr" }: { locale?: Locale }) {
  const sectionCopy = testimonialsContent[locale]
  const testimonials = sectionCopy.items
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
    }, 8000)

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
        <div className="mb-12 text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 block text-sm font-medium tracking-widest text-primary uppercase"
          >
            {sectionCopy.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
                <Quote className="mx-auto mb-6 h-10 w-10 text-primary/30" />
                <blockquote className="mb-8 text-lg leading-relaxed font-medium text-foreground md:mb-10 md:text-2xl lg:text-3xl">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30">
                    <span className="text-lg font-bold text-foreground">{testimonials[current].author.charAt(0)}</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{testimonials[current].author}</p>
                  <p className="text-muted-foreground">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/50 transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5"
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
                  className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`}
                  aria-label={sectionCopy.goTo(index)}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/50 transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5"
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
