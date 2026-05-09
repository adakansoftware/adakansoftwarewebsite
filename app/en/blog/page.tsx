import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"

const posts = [
  "What should a strong landing page communicate in the first 5 seconds?",
  "Building a practical color system for brand identity",
  "Performance and perceived speed in Next.js projects",
]

export default function EnglishBlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Short notes"
        gradientText="on digital growth"
        description="Practical notes on design, brand, and frontend development tied to business goals."
        primaryHref="/en/contact"
        primaryLabel="Contact Us"
        secondaryHref="/en/services"
        secondaryLabel="View Services"
      />
      <section className="relative pb-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post} href="/en/contact" className="group rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md transition-colors hover:border-primary/50">
              <span className="text-sm text-primary">Soon</span>
              <h2 className="mt-4 text-2xl font-bold">{post}</h2>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground">
                Contact us to be notified
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
