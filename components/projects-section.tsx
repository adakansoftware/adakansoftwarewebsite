"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { withLocale, type Locale } from "@/lib/i18n"
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

export function ProjectsSection({ locale = "tr" }: { locale?: Locale }) {
  const projects = getProjects(locale)
  const sectionCopy = copy[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])
  const contentY = useTransform(scrollYProgress, [0, 1], [60, -20])

  return (
    <section ref={containerRef} id="projects" className="relative overflow-hidden py-20 md:py-32">
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute top-1/4 right-0 h-1/2 w-1/2 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/10 to-transparent" />
      </motion.div>

      <motion.div style={{ y: contentY }} className="container relative z-10 mx-auto px-6">
        <div className="mb-12 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.span initial={false} className="mb-6 block text-sm font-medium tracking-widest text-primary uppercase">
              {sectionCopy.eyebrow}
            </motion.span>

            <motion.h2 initial={false} className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              {sectionCopy.title}
              <br />
              <span className="text-gradient">{sectionCopy.gradient}</span>
            </motion.h2>
          </div>

          <motion.div initial={false}>
            <Link href={withLocale("/projects", locale)} className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <span className="text-sm">{sectionCopy.all}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function ProjectCard({
  project,
  isHovered,
  onHover,
  onLeave,
}: {
  project: Project
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <motion.div initial={false} className="group" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <Link href={project.href} className="block">
        <div className="premium-border relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${project.color}20 0%, transparent 50%, ${project.color}10 100%)`,
            }}
          />

          <div className="absolute inset-0 grid-pattern opacity-20 transition-opacity duration-300 group-hover:opacity-40" />

          <div className="absolute inset-x-4 top-14 h-24 rounded-xl border border-white/10 bg-background/35 backdrop-blur-md sm:inset-x-6 sm:top-20 sm:h-28">
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

          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at center, ${project.color}10 0%, transparent 70%)`,
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-xs text-foreground/70 backdrop-blur-md">
                {project.category}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 opacity-100 backdrop-blur-md transition-all duration-300 md:opacity-0 ${
                  isHovered ? "md:scale-100 md:opacity-100" : "md:scale-75"
                }`}
              >
                <ArrowUpRight className="h-4 w-4 text-foreground" />
              </div>
            </div>

            <div>
              <h3
                className={`mb-2 text-3xl font-bold text-foreground transition-transform duration-300 md:text-4xl ${
                  isHovered ? "translate-x-2" : ""
                }`}
              >
                {project.title}
              </h3>
              <p
                className={`max-w-xs text-sm text-foreground/70 opacity-100 transition-opacity duration-300 md:text-foreground/60 ${
                  isHovered ? "md:opacity-100" : "md:opacity-0"
                }`}
              >
                {project.description}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 rounded-2xl border border-border/50 transition-colors duration-300 group-hover:border-primary/30" />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-muted-foreground">{project.year}</span>
          <div className="mx-4 h-px flex-1 bg-border/50" />
          <span className="text-sm text-muted-foreground">{project.category}</span>
        </div>
      </Link>
    </motion.div>
  )
}
