import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { projects } from "@/lib/site-data"

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projeler"
        title="Seçilmiş işler,"
        gradientText="ölçülebilir etki"
        description="Her proje; marka anlatısı, kullanıcı deneyimi ve teknik uygulamanın aynı hedefe bağlandığı bir çalışma alanı olarak ele alındı."
        primaryHref="/contact"
        primaryLabel="Benzer Proje Başlat"
        secondaryHref="/services"
        secondaryLabel="Hizmetleri Gör"
      />

      <section className="relative pb-32">
        <div className="section-shell grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              id={project.href.split("#")[1]}
              className="group rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-md premium-border"
            >
              <div
                className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${project.color}30, transparent 55%, ${project.color}18)`,
                }}
              >
                <div className="absolute inset-0 grid-pattern opacity-25" />
                <div className="absolute inset-x-6 top-8 rounded-xl border border-white/10 bg-background/35 p-5 backdrop-blur-md">
                  <div className="mb-5 flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
                  </div>
                  <div className="space-y-3">
                    <span className="block h-3 w-1/2 rounded-full bg-white/25" />
                    <span className="block h-10 rounded-lg" style={{ backgroundColor: `${project.color}35` }} />
                    <span className="block h-3 w-2/3 rounded-full bg-white/15" />
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {project.category} / {project.year}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold">{project.title}</h2>
                  <p className="mt-4 text-muted-foreground">{project.description}</p>
                </div>
                <ArrowUpRight className="mt-2 h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </article>
          ))}
        </div>

        <div className="section-shell mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border/50 px-6 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            Projeni konuşalım
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
