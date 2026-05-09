import { PageHeader } from "@/components/page-header"

export default function EnglishPrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="A transparent"
        gradientText="data approach"
        description="This page summarizes how contact information shared through the website is handled."
        primaryHref="/en/contact"
        primaryLabel="Contact Us"
      />
      <section className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-6 text-muted-foreground">
          <p>Information you share for contact purposes is used only to respond to your request and conduct project communication.</p>
          <p>Your information is not shared with third parties for sales or advertising purposes. Personal data is protected except for legal obligations.</p>
          <p>For deletion or update requests, you can contact us at merhaba@adakan.com.tr.</p>
        </div>
      </section>
    </>
  )
}
