"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { philosophySectionContent } from "@/lib/home-content"
import type { Locale } from "@/lib/i18n"

export function PhilosophySection({ locale = "tr" }: { locale?: Locale }) {
  const sectionCopy = philosophySectionContent[locale]
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])
  const contentY = useTransform(scrollYProgress, [0, 1], [64, -22])

  return (
    <section ref={containerRef} id="philosophy" className="relative overflow-hidden py-20 md:py-32">
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="text-[15vw] font-bold tracking-tighter text-border/[0.02] whitespace-nowrap">{sectionCopy.background}</span>
      </motion.div>

      <motion.div style={{ y: contentY }} className="container relative z-10 mx-auto px-6">
        <div className="mb-14 max-w-4xl md:mb-24">
          <motion.span initial={false} className="mb-6 block text-sm font-medium tracking-widest text-primary uppercase">
            {sectionCopy.eyebrow}
          </motion.span>

          <motion.h2 initial={false} className="mb-8 text-4xl leading-[1.1] font-bold tracking-tight md:text-6xl lg:text-7xl">
            {sectionCopy.title}
            <br />
            <span className="text-muted-foreground">{sectionCopy.mutedTitle}</span>
          </motion.h2>

          <motion.p initial={false} className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
            {sectionCopy.description}
          </motion.p>
        </div>

        <div className="space-y-10 md:space-y-16">
          {sectionCopy.items.map((item) => (
            <PhilosophyItem key={item.number} item={item} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function PhilosophyItem({ item }: { item: { number: string; title: string; description: string } }) {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="group grid gap-4 md:grid-cols-12 md:items-start md:gap-8">
      <div className="md:col-span-2">
        <span className="text-5xl font-bold text-border/15 transition-colors duration-500 group-hover:text-primary/15 md:text-7xl">{item.number}</span>
      </div>

      <div className="md:col-span-10 md:col-start-4">
        <div className="border-t border-border/50 pt-5 transition-colors duration-500 group-hover:border-primary/30 md:pt-8">
          <h3 className="mb-4 text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary md:text-3xl">{item.title}</h3>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
