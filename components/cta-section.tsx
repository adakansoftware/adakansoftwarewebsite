"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/magnetic-button"

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      {/* Static Background - no heavy animations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-conic from-primary/10 via-accent/5 to-primary/10 opacity-50" />
        
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.7 0.15 195 / 0.08) 0%, transparent 70%)",
          }}
        />
        
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.2 300 / 0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-15" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          style={prefersReducedMotion ? {} : { y, opacity }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Main Heading */}
          <motion.h2
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          >
            Markanı
            <br />
            <span className="text-gradient">daha güçlü anlatalım</span>
          </motion.h2>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Yeni web siteniz, marka kimliğiniz veya dijital ürününüz için net kapsam, doğru öncelik ve güçlü bir uygulama planı çıkaralım.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <MagneticButton strength={0.2}>
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 group px-10 py-8 text-lg font-medium rounded-full transition-colors duration-300 hover:shadow-xl hover:shadow-foreground/10"
              >
                <Link href="/contact">
                  Görüşmeye Başla
                  <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </Button>
            </MagneticButton>
            
            <MagneticButton strength={0.2}>
              <a
                href="mailto:merhaba@adakan.com.tr"
                className="text-muted-foreground hover:text-foreground transition-colors text-lg font-medium"
              >
                merhaba@adakan.com.tr
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border/30"
          >
            {[
              { value: "4", label: "Ana hizmet alanı" },
              { value: "2-6", label: "Haftalık teslim planı" },
              { value: "100%", label: "Responsive yaklaşım" },
              { value: "TR/EN", label: "Çift dil hazırlığı" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
