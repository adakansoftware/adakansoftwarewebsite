"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    
    // Skip heavy animations on mobile or reduced motion
    if (prefersReducedMotion || window.innerWidth < 768) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
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
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.2
        this.speedY = (Math.random() - 0.5) * 0.2
        this.opacity = Math.random() * 0.3 + 0.1
        this.color = Math.random() > 0.5 ? "136, 206, 231" : "192, 132, 252"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0) this.x = canvas!.width
        if (this.x > canvas!.width) this.x = 0
        if (this.y < 0) this.y = canvas!.height
        if (this.y > canvas!.height) this.y = 0
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
      // Reduced particle count for better performance
      const particleCount = Math.floor((canvas!.width * canvas!.height) / 25000)
      for (let i = 0; i < Math.min(particleCount, 40); i++) {
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
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      drawConnections()
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [prefersReducedMotion])

  // Static fallback for reduced motion or mobile
  if (prefersReducedMotion || isMobile) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 noise opacity-[0.015]" />
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
