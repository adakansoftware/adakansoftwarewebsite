"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const el = glowRef.current
    if (!el) return

    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`
    }

    window.addEventListener("mousemove", move, { passive: true })
    return () => window.removeEventListener("mousemove", move)
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-[400px] w-[400px] rounded-full transition-transform duration-700 ease-out"
      style={{
        background: "radial-gradient(circle, oklch(0.65 0.18 245 / 0.04) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  )
}
