"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  if (prefersReducedMotion) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-[9999] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, oklch(0.76 0.13 174), #0066ff, oklch(0.78 0.14 74))",
      }}
    />
  )
}
