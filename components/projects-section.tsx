"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { projectsSectionContent } from "@/lib/home-content"
import { withLocale, type Locale } from "@/lib/i18n"
import { getProjects } from "@/lib/site-data"

type Project = ReturnType<typeof getProjects>[number]

export function ProjectsSection({ locale = "tr" }: { locale?: Locale }) {
  const projects = getProjects(locale)
  const sectionCopy = projectsSectionContent[locale]
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-60px" })
  const prefersReducedMotion = useReducedMotion()
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

      <motion.div style={{ y: contentY }} className="section-shell">
        <div className="section-frame px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
          <div ref={headingRef} className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <motion.h2
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={prefersReducedMotion || isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
              >
                {sectionCopy.title}
                <br />
                <span className="text-gradient">{sectionCopy.gradient}</span>
              </motion.h2>
            </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={prefersReducedMotion || isHeadingInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
            >
              <Link
                href={withLocale("/projects", locale)}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground"
              >
                <span>{sectionCopy.all}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                locale={locale}
                isHovered={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
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
  locale,
}: {
  project: Project
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  locale: Locale
}) {
  const isExternalProject = project.href.startsWith("http://") || project.href.startsWith("https://")
  const cardRef = useRef<HTMLDivElement>(null)
  const isCardInView = useInView(cardRef, { once: true, margin: "-40px" })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion || isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.015 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform" }}
      className="group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link href={project.href} className="block" target={isExternalProject ? "_blank" : undefined} rel={isExternalProject ? "noreferrer" : undefined}>
        <div className="premium-border panel-sheen relative mb-6 aspect-[4/3] overflow-hidden rounded-[1.75rem]">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${project.color}20 0%, transparent 50%, ${project.color}10 100%)`,
            }}
          />

          {project.coverImage ? (
            <>
              <Image
                src={project.coverImage}
                alt={`${project.title} kapak görseli`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-background/35 to-background/14" />
              {project.logoImage ? (
                <div className="absolute top-1/2 left-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white/95 p-2 shadow-2xl shadow-black/30">
                  <Image
                    src={project.logoImage}
                    alt={`${project.title} logo`}
                    width={320}
                    height={180}
                    className="h-auto w-full object-contain"
                  />
                </div>
              ) : null}
            </>
          ) : null}

          {!project.coverImage ? (
            <>
              <div
                className="absolute inset-0 grid-pattern opacity-20 transition-all duration-500 group-hover:opacity-40"
                style={isHovered ? { backgroundColor: `${project.color}12`, filter: "saturate(1.2)" } : undefined}
              />

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
            </>
          ) : (
            <div
              className="absolute inset-0 grid-pattern opacity-10 transition-all duration-500 group-hover:opacity-20"
              style={isHovered ? { backgroundColor: `${project.color}10`, filter: "saturate(1.1)" } : undefined}
            />
          )}

          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at center, ${project.color}10 0%, transparent 70%)`,
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-xs text-foreground/70 backdrop-blur-md transition-colors duration-300 group-hover:border-accent/45 group-hover:bg-accent group-hover:text-accent-foreground">
                {project.category}
              </span>
              <div className="flex items-center gap-2">
                {isExternalProject ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Canli
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-md">
                    Demo
                  </span>
                )}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 opacity-100 backdrop-blur-md transition-all duration-300 md:opacity-0 ${
                    isHovered ? "md:scale-100 md:opacity-100" : "md:scale-75"
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4 text-foreground" />
                </div>
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
              {!isExternalProject && (
                <p className="mt-2 text-[11px] text-foreground/35 italic">
                  {locale === "tr" ? "Konsept demo — gerçek müşteri projesi değil" : "Concept demo — not a live client project"}
                </p>
              )}
            </div>
          </div>

          <div className="absolute inset-0 rounded-[1.75rem] border border-white/10 transition-colors duration-300 group-hover:border-accent/35" />
          <div className="accent-line absolute right-0 bottom-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div
            className="absolute right-0 bottom-0 left-0 h-[2px] origin-left transition-transform duration-500 ease-out"
            style={{
              background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
              transform: isHovered ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-sm text-muted-foreground transition-colors duration-300" style={isHovered ? { color: project.color } : undefined}>
            {project.year}
          </span>
          <div className="mx-4 h-px flex-1 bg-border/50" />
          <span className="text-sm text-muted-foreground">{project.category}</span>
        </div>
      </Link>
    </motion.div>
  )
}
