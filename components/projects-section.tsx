"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { getLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n"
import { getProjects } from "@/lib/site-data"

type Project = ReturnType<typeof getProjects>[number]

const copy = {
  tr: {
    eyebrow: "Seçilmiş Projeler",
    title: "Görünür sonuç",
    gradient: "üreten işler",
    all: "Tüm Projeleri Gör",
  },
  en: {
    eyebrow: "Selected Projects",
    title: "Work that creates",
    gradient: "visible results",
    all: "View All Projects",
  },
} satisfies Record<Locale, { eyebrow: string; title: string; gradient: string; all: string }>

export function ProjectsSection() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const projects = getProjects(locale)
  const sectionCopy = copy[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <section ref={containerRef} id="projects" className="py-32 relative overflow-hidden">
      {/* Background Element */}
      <motion.div
        style={prefersReducedMotion ? {} : { y: backgroundY }}
        className="absolute right-0 top-1/4 w-1/2 h-1/2 opacity-20 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-primary/10 to-transparent" />
      </motion.div>

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
              {sectionCopy.eyebrow}
            </motion.span>
            
            <motion.h2
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              {sectionCopy.title}
              <br />
              <span className="text-gradient">{sectionCopy.gradient}</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={withLocale("/projects", locale)}
              className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm">{sectionCopy.all}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isHovered,
  onHover,
  onLeave,
  prefersReducedMotion,
}: {
  project: Project
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  prefersReducedMotion: boolean | null
}) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link href={project.href} className="block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 premium-border">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${project.color}20 0%, transparent 50%, ${project.color}10 100%)`,
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20 group-hover:opacity-40 transition-opacity duration-300" />

        <div className="absolute inset-x-6 top-20 h-28 rounded-xl border border-white/10 bg-background/35 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
            <span className="h-2 w-2 rounded-full bg-amber-300/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
          </div>
          <div className="grid grid-cols-3 gap-3 p-4">
            <span className="h-3 rounded-full bg-white/25" />
            <span className="h-3 rounded-full bg-white/15" />
            <span className="h-3 rounded-full bg-white/10" />
            <span className="col-span-2 h-8 rounded-lg" style={{ backgroundColor: `${project.color}35` }} />
            <span className="h-8 rounded-lg bg-white/10" />
          </div>
        </div>
        
        {/* Glow Effect - simplified */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${project.color}10 0%, transparent 70%)`,
          }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="px-4 py-2 rounded-full text-xs bg-foreground/5 backdrop-blur-md border border-foreground/10 text-foreground/70">
              {project.category}
            </span>
            <div
              className={`w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </div>
          </div>

          <div>
            <h3
              className={`text-3xl md:text-4xl font-bold text-foreground mb-2 transition-transform duration-300 ${
                isHovered ? "translate-x-2" : ""
              }`}
            >
              {project.title}
            </h3>
            <p className={`text-foreground/60 text-sm max-w-xs transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}>
              {project.description}
            </p>
          </div>
        </div>

        {/* Border */}
        <div className="absolute inset-0 rounded-2xl border border-border/50 group-hover:border-primary/30 transition-colors duration-300" />
      </div>

      {/* Project Info */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-mono">{project.year}</span>
        <div className="h-px flex-1 mx-4 bg-border/50" />
        <span className="text-muted-foreground text-sm">{project.category}</span>
      </div>
      </Link>
    </motion.div>
  )
}
