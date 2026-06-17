"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

const finePointerQuery = "(hover: hover) and (pointer: fine)"

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    if (prefersReduced) {
      setIsEnabled(false)
      return
    }

    const mediaQuery = window.matchMedia(finePointerQuery)
    const syncEnabledState = () => setIsEnabled(mediaQuery.matches)

    syncEnabledState()
    mediaQuery.addEventListener("change", syncEnabledState)

    return () => mediaQuery.removeEventListener("change", syncEnabledState)
  }, [prefersReduced])

  useEffect(() => {
    if (!isEnabled) return

    const el = glowRef.current
    if (!el) return

    let rafId = 0
    let nextX = 0
    let nextY = 0

    const applyPosition = () => {
      rafId = 0
      el.style.transform = `translate(${nextX - 200}px, ${nextY - 200}px)`
    }

    const move = (event: MouseEvent) => {
      nextX = event.clientX
      nextY = event.clientY

      if (!rafId) {
        rafId = window.requestAnimationFrame(applyPosition)
      }
    }

    window.addEventListener("mousemove", move, { passive: true })

    return () => {
      window.removeEventListener("mousemove", move)
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [isEnabled])

  if (!isEnabled) return null

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
