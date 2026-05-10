"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import type { Locale } from "@/lib/i18n"

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

export function PhilosophySection({ locale = "tr" }: { locale?: Locale }) {
  const sectionCopy = copy[locale]
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])
  const contentY = useTransform(scrollYProgress, [0, 1], [64, -22])

  return (
    <section ref={containerRef} id="philosophy" className="relative overflow-hidden py-20 md:py-32">
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[15vw] font-bold text-border/[0.02] tracking-tighter whitespace-nowrap">
          {sectionCopy.background}
        </span>
      </motion.div>

      <motion.div style={{ y: contentY }} className="container mx-auto px-6 relative z-10">
        <div className="mb-14 max-w-4xl md:mb-24">
          <motion.span
            initial={false}
            className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block"
          >
            {sectionCopy.eyebrow}
          </motion.span>

          <motion.h2
            initial={false}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            {sectionCopy.title}
            <br />
            <span className="text-muted-foreground">{sectionCopy.mutedTitle}</span>
          </motion.h2>

          <motion.p
            initial={false}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            {sectionCopy.description}
          </motion.p>
        </div>

        <div className="space-y-10 md:space-y-16">
          {sectionCopy.items.map((item) => (
            <PhilosophyItem key={item.number} item={item} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function PhilosophyItem({
  item,
}: {
  item: { number: string; title: string; description: string }
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="group grid gap-4 md:grid-cols-12 md:items-start md:gap-8"
    >
      <div className="md:col-span-2">
        <span className="text-5xl font-bold text-border/15 transition-colors duration-500 group-hover:text-primary/15 md:text-7xl">
          {item.number}
        </span>
      </div>

      <div className="md:col-span-10 md:col-start-4">
        <div className="border-t border-border/50 pt-5 transition-colors duration-500 group-hover:border-primary/30 md:pt-8">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{item.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
