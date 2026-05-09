"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const services = [
  {
    title: "Web Tasarım",
    description: "Markanın değerini ilk ekranda hissettiren, hızlı, erişilebilir ve dönüşüm odaklı web siteleri tasarlarız.",
    tags: ["Kurumsal site", "Landing page", "E-ticaret"],
  },
  {
    title: "Marka Kimliği",
    description: "Logo, renk, tipografi ve görsel dilin tek bir sistem gibi çalıştığı güçlü marka kimlikleri kurarız.",
    tags: ["Logo", "Görsel sistem", "Marka rehberi"],
  },
  {
    title: "UI/UX Tasarım",
    description: "Karmaşık akışları sadeleştirir, kullanıcıların ürünü anlamasını ve tekrar kullanmasını kolaylaştırırız.",
    tags: ["SaaS", "Panel", "Mobil uygulama"],
  },
  {
    title: "Frontend Geliştirme",
    description: "Tasarımları performanslı, responsive ve sürdürülebilir Next.js arayüzlerine dönüştürürüz.",
    tags: ["Next.js", "Animasyon", "Performans"],
  },
]

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])

  return (
    <section ref={containerRef} id="services" className="py-32 relative">
      {/* Subtle Background Grid */}
      <motion.div
        style={prefersReducedMotion ? {} : { y: backgroundY }}
        className="absolute inset-0 grid-pattern opacity-20"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.span
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block"
            >
              Hizmetlerimiz
            </motion.span>
            
            <motion.h2
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              Net hedef,
              <br />
              <span className="text-gradient">ölçülebilir etki</span>
            </motion.h2>
          </div>
          
          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-md leading-relaxed"
          >
            Güzel görünen işler yapmanın ötesine geçiyoruz: konumlandırma, deneyim ve teknik uygulama aynı hedefe bağlanıyor.
          </motion.p>
        </div>

        {/* Services List */}
        <div className="space-y-2">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index, prefersReducedMotion }: { service: typeof services[0]; index: number; prefersReducedMotion: boolean | null }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <div className="relative py-8 border-t border-border/50 hover:border-primary/50 transition-colors duration-300">
        {/* Hover Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative grid md:grid-cols-12 gap-6 items-center">
          {/* Number */}
          <div className="md:col-span-1">
            <span className="text-sm text-muted-foreground font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Title */}
          <div className="md:col-span-3">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {service.title}
            </h3>
          </div>

          {/* Description */}
          <div className="md:col-span-5">
            <p className="text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Tags & Arrow */}
          <div className="md:col-span-3 flex items-center justify-between gap-4">
            <div className="hidden lg:flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-border/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-primary/50 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
