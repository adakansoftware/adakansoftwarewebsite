import { PageHeader } from "@/components/page-header"

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kullanım Şartları"
        title="Web sitesini"
        gradientText="doğru kullanım"
        description="Bu sayfa, Adakan Software web sitesinin genel kullanım şartlarını özetler."
        primaryHref="/contact"
        primaryLabel="Soru Sor"
      />
      <section className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-6 text-muted-foreground">
          <p>Bu web sitesindeki metin, görsel ve marka öğeleri Adakan Software’e aittir veya tanıtım amacıyla kullanılır.</p>
          <p>Site içeriği izinsiz kopyalanamaz, çoğaltılamaz veya yanıltıcı şekilde kullanılamaz.</p>
          <p>Proje kapsamı, teklif ve teslim koşulları her müşteri için ayrıca yazılı olarak belirlenir.</p>
        </div>
      </section>
    </>
  )
}
