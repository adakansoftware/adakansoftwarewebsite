"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.12 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.12 })

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    x.set((clientX - left - width / 2) * strength)
    y.set((clientY - top - height / 2) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  )
}
