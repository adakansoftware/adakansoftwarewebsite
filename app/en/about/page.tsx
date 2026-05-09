import { PageHeader } from "@/components/page-header"

export default function EnglishAboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="We bring design"
        gradientText="and software together"
        description="Adakan Software is a design and software studio creating strategic websites, brand identities, and digital product interfaces for ambitious brands."
        primaryHref="/en/contact"
        primaryLabel="Start a Project"
        secondaryHref="/en/projects"
        secondaryLabel="View Projects"
      />
      <section className="relative pb-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {[
            ["Clarity", "We simplify what the brand communicates and send the right signal in the first seconds."],
            ["Craft", "Typography, spacing, speed, and motion are used to strengthen brand perception."],
            ["Continuity", "We care that the delivered work remains manageable and extensible after launch."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-4 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
