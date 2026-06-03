"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right"
}

export function SectionReveal({ children, className, delay = 0, direction = "up" }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const prefersReducedMotion = useReducedMotion()

  const variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : direction === "up" ? 32 : 0,
      x: prefersReducedMotion ? 0 : direction === "left" ? -32 : direction === "right" ? 32 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.7,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
