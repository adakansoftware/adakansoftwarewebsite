"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

type LogoSection = { title: string; description: string; points: string[] }

export function LogoServiceCards({ sections }: { sections: LogoSection[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {sections.map((section, index) => (
        <LogoServiceCard key={section.title} section={section} index={index} />
      ))}
    </div>
  )
}

function LogoServiceCard({ section, index }: { section: LogoSection; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="premium-border group rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-md transition-colors duration-300 hover:border-accent/40"
    >
      <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
      <h2 className="mt-5 text-2xl font-bold transition-colors duration-300 group-hover:text-accent">{section.title}</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">{section.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {section.points.map((point) => (
          <span
            key={point}
            className="rounded-full border border-border/50 bg-background/35 px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-300 group-hover:border-accent/30"
          >
            {point}
          </span>
        ))}
      </div>
    </motion.article>
  )
}
