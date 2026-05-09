import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"

export default function EnglishCareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="We work with people"
        gradientText="who care about craft"
        description="We are not sharing active openings right now, but we are always happy to see strong portfolios in design, frontend, and brand strategy."
        primaryHref="mailto:merhaba@adakan.com.tr"
        primaryLabel="Send Portfolio"
        secondaryHref="/en/about"
        secondaryLabel="Meet Us"
      />
      <section className="relative pb-32">
        <div className="section-shell rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold">Portfolio submissions</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A short introduction, selected work, and the role where you want to contribute are enough.
          </p>
          <Link href="mailto:merhaba@adakan.com.tr" className="mt-8 inline-flex items-center gap-2 text-primary">
            merhaba@adakan.com.tr
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
