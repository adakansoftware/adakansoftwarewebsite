import { PageHeader } from "@/components/page-header"

export default function EnglishTermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Using the website"
        gradientText="properly"
        description="This page summarizes the general terms for using the Adakan Software website."
        primaryHref="/en/contact"
        primaryLabel="Ask a Question"
      />
      <section className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-6 text-muted-foreground">
          <p>The text, visuals, and brand elements on this website belong to Adakan Software or are used for promotional purposes.</p>
          <p>Site content may not be copied, reproduced, or used in a misleading way without permission.</p>
          <p>Project scope, pricing, and delivery terms are defined separately in writing for each client.</p>
        </div>
      </section>
    </>
  )
}
