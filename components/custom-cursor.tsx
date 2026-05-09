"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isHidden, setIsHidden] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Lighter spring config for better performance
  const springConfig = { damping: 30, stiffness: 300, mass: 0.3 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const moveCursor = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    },
    [cursorX, cursorY]
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Skip on touch devices or reduced motion
    const hasTouch = "ontouchstart" in window
    if (hasTouch || prefersReducedMotion || window.innerWidth < 1024) {
      setIsHidden(true)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      moveCursor(e)
      setIsHidden(false)
    }

    const handleMouseLeave = () => setIsHidden(true)

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveElement = target.closest("a, button, [data-cursor]")
      setIsHovering(!!interactiveElement)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleElementHover, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleElementHover)
    }
  }, [moveCursor, prefersReducedMotion])

  // Don't render on mobile/tablet or reduced motion
  if (!isMounted || prefersReducedMotion) {
    return null
  }

  return (
    <>
      {/* Main dot cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHidden ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          <div className="w-3 h-3 rounded-full bg-white" />
        </motion.div>
      </motion.div>

      {/* Outer ring - simplified */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:block will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            width: isHovering ? 60 : 32,
            height: isHovering ? 60 : 32,
            opacity: isHidden ? 0 : 0.3,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full h-full rounded-full border border-white/50" />
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @media (min-width: 1024px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  )
}
