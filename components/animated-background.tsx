"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
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
      const surface = window.innerWidth * window.innerHeight
      const particleCount = Math.floor(surface / 32000)
      const maxParticles = window.innerWidth < 768 ? 18 : 34
      for (let i = 0; i < Math.min(Math.max(particleCount, 8), maxParticles); i++) {
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
      window.removeEventListener("resize", handleResize)
      if (resizeTimeout) window.clearTimeout(resizeTimeout)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      <motion.div
        className="absolute left-[-8rem] top-[-3rem] h-[18rem] w-[18rem] rounded-full will-change-transform sm:left-0 sm:top-0 sm:h-[28rem] sm:w-[28rem] md:h-[38rem] md:w-[38rem]"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.08) 0%, transparent 62%)",
        }}
        animate={{
          x: [-50, 35, -50],
          y: [-20, 55, -20],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-[-4rem] right-[-4rem] h-[16rem] w-[16rem] rounded-full will-change-transform sm:bottom-0 sm:right-0 sm:h-[24rem] sm:w-[24rem] md:h-[32rem] md:w-[32rem]"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.06) 0%, transparent 62%)",
        }}
        animate={{
          x: [30, -45, 30],
          y: [25, -30, 25],
        }}
        transition={{
          duration: 22,
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
