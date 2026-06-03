"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

type Card = { title: string; description: string }

export function AboutCards({ cards }: { cards: Card[] }) {
  return (
    <div className="section-shell grid gap-6 md:grid-cols-3">
      {cards.map((card, index) => (
        <AnimatedCard key={card.title} card={card} index={index} />
      ))}
    </div>
  )
}

function AnimatedCard({ card, index }: { card: Card; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md transition-colors duration-300 hover:border-primary/40 hover:bg-card/40"
    >
      <h2 className="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">{card.title}</h2>
      <p className="mt-4 text-muted-foreground">{card.description}</p>
    </motion.article>
  )
}
