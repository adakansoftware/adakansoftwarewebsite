import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"

const posts = [
  "İyi bir landing page ilk 5 saniyede ne anlatmalı?",
  "Marka kimliğinde renk sistemini doğru kurmak",
  "Next.js projelerinde performans ve algılanan hız",
]

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Dijital büyüme üzerine"
        gradientText="kısa notlar"
        description="Tasarım, marka ve frontend geliştirme tarafında iş hedeflerine bağlanan pratik notlar."
        secondaryHref="/services"
        secondaryLabel="Hizmetleri Gör"
      />
      <section className="relative pb-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post}
              href="/contact"
              className="group rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md transition-colors hover:border-primary/50"
            >
              <span className="text-sm text-primary">Yakında</span>
              <h2 className="mt-4 text-2xl font-bold">{post}</h2>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground">
                Haberdar olmak için iletişime geç
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
