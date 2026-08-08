"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { motion, useInView, useReducedMotion } from "framer-motion"

import { withLocale, type Locale } from "@/lib/i18n"

const pricing = {
  tr: {
    eyebrow: "Net kapsam, net yatırım",
    title: "İhtiyaca göre",
    gradient: "esnek fiyatlandırma",
    description: "Her proje için kapsamı birlikte netleştiririz. Aşağıdaki aralıklar, doğru başlangıç noktasını seçmene yardımcı olur.",
    cta: "Kapsamı konuşalım",
    items: [
      { name: "Marka başlangıcı", price: "₺15.000", note: "Logo & marka kimliği", features: ["Logo sistemi", "Renk ve tipografi", "Teslim dosyaları"] },
      { name: "Kurumsal web", price: "₺25.000", note: "Web sitesi", features: ["Stratejik sayfa akışı", "Responsive arayüz", "Yayına alma desteği"], featured: true },
      { name: "Dijital ürün", price: "₺40.000", note: "UI/UX & frontend", features: ["Ürün akışları", "Tasarım sistemi", "Next.js geliştirme"] },
    ],
  },
  en: {
    eyebrow: "Clear scope, clear investment",
    title: "Flexible pricing",
    gradient: "for real needs",
    description: "We define the scope together. These ranges help identify the right starting point for your project.",
    cta: "Discuss your scope",
    items: [
      { name: "Brand foundation", price: "€800", note: "Logo & brand identity", features: ["Logo system", "Color and typography", "Delivery files"] },
      { name: "Corporate web", price: "€1.500", note: "Website", features: ["Strategic page flow", "Responsive interface", "Launch support"], featured: true },
      { name: "Digital product", price: "€3.000", note: "UI/UX & frontend", features: ["Product flows", "Design system", "Next.js development"] },
    ],
  },
} satisfies Record<Locale, { eyebrow: string; title: string; gradient: string; description: string; cta: string; items: Array<{ name: string; price: string; note: string; features: string[]; featured?: boolean }> }>

export function PricingSection({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const reducedMotion = useReducedMotion()
  const copy = pricing[locale]

  return <section id="pricing" className="relative overflow-hidden py-20 md:py-32"><div className="pointer-events-none absolute inset-0 grid-pattern opacity-10" /><div ref={ref} className="section-shell"><div className="section-frame px-5 py-8 sm:px-7 lg:px-10 lg:py-10"><motion.div initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={reducedMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl"><p className="section-kicker">{copy.eyebrow}</p><h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">{copy.title}<br /><span className="text-gradient">{copy.gradient}</span></h2><p className="mt-5 max-w-xl text-muted-foreground">{copy.description}</p></motion.div><div className="mt-10 grid gap-5 lg:grid-cols-3">{copy.items.map((item, index) => <motion.article key={item.name} initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={reducedMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.12 + index * 0.08, ease: [0.22, 1, 0.36, 1] }} className={`premium-border relative rounded-2xl border p-6 ${item.featured ? "border-accent/55 bg-card/55" : "border-border/50 bg-card/25"}`}><p className="text-sm text-muted-foreground">{item.note}</p><h3 className="mt-3 text-xl font-bold">{item.name}</h3><p className="mt-7 text-4xl font-bold">{item.price}<span className="ml-2 text-sm font-normal text-muted-foreground">{locale === "tr" ? "başlangıç" : "starting at"}</span></p><ul className="mt-7 space-y-3 border-t border-border/50 pt-6">{item.features.map((feature) => <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="h-4 w-4 text-accent" />{feature}</li>)}</ul><Link href={withLocale("/contact", locale)} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent">{copy.cta}<ArrowUpRight className="h-4 w-4" /></Link></motion.article>)}</div></div></div></section>
}
