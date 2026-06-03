"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const el = glowRef.current
    if (!el) return

    const move = (event: MouseEvent) => {
      el.style.transform = `translate(${event.clientX - 200}px, ${event.clientY - 200}px)`
    }

    window.addEventListener("mousemove", move, { passive: true })
    return () => window.removeEventListener("mousemove", move)
  }, [prefersReduced])

  if (prefersReduced) return null

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-[400px] w-[400px] rounded-full"
      style={{
        background: "radial-gradient(circle, oklch(0.65 0.18 245 / 0.04) 0%, transparent 70%)",
        willChange: "transform",
        top: 0,
        left: 0,
      }}
    />
  )
}
