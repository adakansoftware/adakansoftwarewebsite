import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kariyer"
        title="İyi iş üretmeyi seven"
        gradientText="insanlarla çalışırız"
        description="Şu an aktif ilan paylaşmıyoruz; fakat tasarım, frontend ve marka stratejisi alanlarında güçlü portfolyoları her zaman görmek isteriz."
        primaryHref="mailto:merhaba@adakan.com.tr"
        primaryLabel="Portfolyo Gönder"
        secondaryHref="/about"
        secondaryLabel="Bizi Tanı"
      />
      <section className="relative pb-32">
        <div className="section-shell rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold">Portfolyo paylaşımı</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Kısa bir tanıtım, seçilmiş işleriniz ve hangi rolde değer katmak istediğiniz yeterli.
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
