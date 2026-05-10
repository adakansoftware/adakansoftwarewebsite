"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const updateMode = () => setIsMobile(media.matches)
    updateMode()
    media.addEventListener("change", updateMode)

    if (prefersReducedMotion || media.matches) {
      return () => media.removeEventListener("change", updateMode)
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return () => media.removeEventListener("change", updateMode)
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return () => media.removeEventListener("change", updateMode)
    }

    let animationFrameId: number
    let particles: Particle[] = []
    let resizeTimeout: number | null = null

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(window.innerWidth * pixelRatio)
      canvas.height = Math.floor(window.innerHeight * pixelRatio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      initParticles()
    }

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.2
        this.speedY = (Math.random() - 0.5) * 0.2
        this.opacity = Math.random() * 0.3 + 0.1
        this.color = Math.random() > 0.5 ? "136, 206, 231" : "192, 132, 252"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0) this.x = window.innerWidth
        if (this.x > window.innerWidth) this.x = 0
        if (this.y < 0) this.y = window.innerHeight
        if (this.y > window.innerHeight) this.y = 0
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 28000)
      for (let i = 0; i < Math.min(particleCount, 34); i++) {
        particles.push(new Particle())
      }
    }

    const drawConnections = () => {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.08
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(136, 206, 231, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      if (!ctx) return
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      drawConnections()
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(resize, 120)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    resize()
    animate()

    return () => {
      media.removeEventListener("change", updateMode)
      window.removeEventListener("resize", handleResize)
      if (resizeTimeout) window.clearTimeout(resizeTimeout)
      cancelAnimationFrame(animationFrameId)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 noise opacity-[0.015]" />
      </div>
    )
  }

  // Lightweight animated fallback for mobile
  if (isMobile) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute -left-16 top-16 h-56 w-56 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.12) 0%, transparent 68%)",
          }}
          animate={{
            x: [-12, 18, -12],
            y: [-8, 20, -8],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-10 right-[-2.5rem] h-52 w-52 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.78 0.14 74 / 0.1) 0%, transparent 68%)",
          }}
          animate={{
            x: [10, -16, 10],
            y: [8, -18, 8],
            scale: [1.02, 0.98, 1.02],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 h-28 w-28 -translate-x-1/2 rounded-full border border-primary/12"
          animate={{
            opacity: [0.18, 0.32, 0.18],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.018]" />
        <div className="absolute inset-0 noise opacity-[0.02]" />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, var(--background) 82%)",
          }}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      {/* Simplified glow orbs - using CSS transforms only */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.06) 0%, transparent 60%)",
        }}
        animate={{
          x: [-100, 50, -100],
          y: [-50, 100, -50],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.04) 0%, transparent 60%)",
        }}
        animate={{
          x: [50, -100, 50],
          y: [50, -50, 50],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="absolute inset-0 noise opacity-[0.015]" />
      <div className="absolute inset-0 grid-pattern opacity-[0.015]" />

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, var(--background) 80%)",
        }}
      />
    </div>
  )
}
