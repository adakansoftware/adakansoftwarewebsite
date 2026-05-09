"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion"

const philosophyItems = [
  {
    number: "01",
    title: "Önce strateji",
    description: "Her ekranın neyi anlatacağını, hangi itirazı azaltacağını ve hangi aksiyonu güçlendireceğini en başta netleştiririz.",
  },
  {
    number: "02",
    title: "Sonra zanaat",
    description: "Tipografi, boşluk, hareket ve mikro etkileşimleri yalnızca estetik için değil, algıyı ve kullanımı iyileştirmek için kurarız.",
  },
  {
    number: "03",
    title: "En sonda sürdürülebilirlik",
    description: "Teslim edilen işin hızlı, yönetilebilir ve geliştirilebilir kalmasına önem veririz. İyi tasarım, yayına çıktıktan sonra da çalışır.",
  },
]

export function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <section ref={containerRef} id="philosophy" className="py-32 relative overflow-hidden">
      {/* Background Text */}
      <motion.div
        style={prefersReducedMotion ? {} : { y: backgroundY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[15vw] font-bold text-border/[0.02] tracking-tighter whitespace-nowrap">
          YAKLAŞIM
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mb-24">
          <motion.span
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block"
          >
            Yaklaşımımız
          </motion.span>
          
          <motion.h2
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            Harika tasarım
            <br />
            <span className="text-muted-foreground">sessizce güven verir.</span>
          </motion.h2>
          
          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            Parlak efektlerin arkasına saklanmayan, markanın değerini netleştiren ve kullanıcıyı doğru aksiyona taşıyan deneyimler tasarlıyoruz.
          </motion.p>
        </div>

        {/* Philosophy Items */}
        <div className="space-y-16">
          {philosophyItems.map((item, index) => (
            <PhilosophyItem key={item.number} item={item} index={index} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PhilosophyItem({ item, index, prefersReducedMotion }: { item: typeof philosophyItems[0]; index: number; prefersReducedMotion: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="grid md:grid-cols-12 gap-8 items-start group"
    >
      {/* Number */}
      <div className="md:col-span-2">
        <span className="text-6xl md:text-7xl font-bold text-border/15 group-hover:text-primary/15 transition-colors duration-500">
          {item.number}
        </span>
      </div>

      {/* Content */}
      <div className="md:col-span-10 md:col-start-4">
        <div className="border-t border-border/50 group-hover:border-primary/30 transition-colors duration-500 pt-8">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
