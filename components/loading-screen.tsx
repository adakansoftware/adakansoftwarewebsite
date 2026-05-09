"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Faster loading for better UX
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoading(false), 400)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 60)

    return () => clearInterval(timer)
  }, [])

  // Skip loading screen for reduced motion preference
  if (prefersReducedMotion) {
    return null
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <span className="text-4xl font-bold tracking-tighter">
              <span className="text-foreground">Adakan</span>
              <span className="text-primary">.</span>
            </span>
          </motion.div>

          <div className="w-64 h-[1px] bg-border/20 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center gap-4"
          >
            <span className="text-xs text-muted-foreground font-mono tracking-wider">
              Yukleniyor
            </span>
            <span className="text-xs text-foreground font-mono">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
