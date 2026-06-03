"use client"

import { motion } from "framer-motion"

export function FooterWordmark() {
  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[clamp(4.5rem,10vw,8rem)] overflow-hidden select-none">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.04, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-aquire absolute right-0 bottom-[-0.38em] left-0 text-[clamp(80px,15vw,180px)] leading-none font-bold tracking-normal whitespace-nowrap text-foreground"
      >
        ADAKAN
      </motion.div>
    </div>
  )
}
