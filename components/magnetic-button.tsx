"use client"

import { useRef, useState, type ReactNode, type MouseEvent } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const x = (clientX - left - width / 2) * strength
    const y = (clientY - top - height / 2) * strength
    setPosition({ x, y })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  // Skip magnetic effect on reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.1 }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  )
}
