"use client"

import { useRef } from "react"
import { usePathname } from "next/navigation"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { getLocaleFromPathname, type Locale } from "@/lib/i18n"

const copy = {
  tr: {
    background: "YAKLAŞIM",
    eyebrow: "Yaklaşımımız",
    title: "Harika tasarım",
    mutedTitle: "sessizce güven verir.",
    description: "Parlak efektlerin arkasına saklanmayan, markanın değerini netleştiren ve kullanıcıyı doğru aksiyona taşıyan deneyimler tasarlıyoruz.",
    items: [
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
    ],
  },
  en: {
    background: "APPROACH",
    eyebrow: "Our Approach",
    title: "Great design",
    mutedTitle: "quietly builds trust.",
    description: "We design experiences that clarify brand value and guide users toward the right action, without hiding behind shiny effects.",
    items: [
      {
        number: "01",
        title: "Strategy first",
        description: "We clarify what each screen should communicate, which objection it should reduce, and which action it should support.",
      },
      {
        number: "02",
        title: "Craft second",
        description: "Typography, spacing, motion, and micro-interactions are used to improve perception and usability, not decoration alone.",
      },
      {
        number: "03",
        title: "Sustainability last",
        description: "We care that the delivered work remains fast, manageable, and extensible after launch. Good design keeps working.",
      },
    ],
  },
} satisfies Record<Locale, {
  background: string
  eyebrow: string
  title: string
  mutedTitle: string
  description: string
  items: Array<{ number: string; title: string; description: string }>
}>

export function PhilosophySection() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const sectionCopy = copy[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <section ref={containerRef} id="philosophy" className="py-32 relative overflow-hidden">
      <motion.div
        style={prefersReducedMotion ? {} : { y: backgroundY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[15vw] font-bold text-border/[0.02] tracking-tighter whitespace-nowrap">
          {sectionCopy.background}
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-24">
          <motion.span
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block"
          >
            {sectionCopy.eyebrow}
          </motion.span>

          <motion.h2
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            {sectionCopy.title}
            <br />
            <span className="text-muted-foreground">{sectionCopy.mutedTitle}</span>
          </motion.h2>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            {sectionCopy.description}
          </motion.p>
        </div>

        <div className="space-y-16">
          {sectionCopy.items.map((item, index) => (
            <PhilosophyItem key={item.number} item={item} index={index} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PhilosophyItem({
  item,
  index,
  prefersReducedMotion,
}: {
  item: { number: string; title: string; description: string }
  index: number
  prefersReducedMotion: boolean | null
}) {
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
      <div className="md:col-span-2">
        <span className="text-6xl md:text-7xl font-bold text-border/15 group-hover:text-primary/15 transition-colors duration-500">
          {item.number}
        </span>
      </div>

      <div className="md:col-span-10 md:col-start-4">
        <div className="border-t border-border/50 group-hover:border-primary/30 transition-colors duration-500 pt-8">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{item.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
