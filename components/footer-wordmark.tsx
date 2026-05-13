"use client"

import { motion } from "framer-motion"

export function FooterWordmark() {
  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-[12vw] leading-none font-bold tracking-tighter text-border/[0.02] whitespace-nowrap"
      >
        ADAKAN
      </motion.div>
    </div>
  )
}
