"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

type ServiceDetail = { id: string; title: string; outcome: string; items: string[] }

export function ServiceDetailCards({ details }: { details: ServiceDetail[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {details.map((service, index) => (
        <ServiceDetailCard key={service.id} service={service} index={index} />
      ))}
    </div>
  )
}

function ServiceDetailCard({ service, index }: { service: ServiceDetail; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      ref={ref}
      id={service.id}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="premium-border group rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md transition-colors duration-300 hover:border-primary/40"
    >
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold transition-colors duration-300 group-hover:text-primary">{service.title}</h2>
        </div>
        <ArrowUpRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="mb-8 text-muted-foreground">{service.outcome}</p>
      <ul className="space-y-3">
        {service.items.map((item) => (
          <li key={item} className="border-t border-border/40 pt-3 text-sm text-foreground/85">
            {item}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}
