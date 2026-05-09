import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { services } from "@/lib/site-data"

const details = [
  {
    id: "web-design",
    title: "Web Tasarım",
    outcome: "İlk izlenimi güçlendiren, hızlı ve satış odaklı web deneyimleri.",
    items: ["Kurumsal web sitesi", "Landing page", "E-ticaret vitrinleri", "SEO uyumlu sayfa mimarisi"],
  },
  {
    id: "brand-identity",
    title: "Marka Kimliği",
    outcome: "Logo, renk, tipografi ve görsel dili tek bir sistemde toplarız.",
    items: ["Logo sistemi", "Renk ve tipografi", "Sosyal medya şablonları", "Marka kullanım rehberi"],
  },
  {
    id: "ui-ux",
    title: "UI/UX Tasarım",
    outcome: "Ürün akışlarını sadeleştirir, kullanıcı kararlarını kolaylaştırırız.",
    items: ["SaaS panel tasarımı", "Mobil uygulama arayüzleri", "Wireframe ve prototip", "Kullanıcı yolculuğu"],
  },
  {
    id: "frontend",
    title: "Frontend Geliştirme",
    outcome: "Tasarımları performanslı ve sürdürülebilir Next.js arayüzlerine dönüştürürüz.",
    items: ["Next.js geliştirme", "Responsive uygulama", "Animasyon sistemi", "Performans optimizasyonu"],
  },
]

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hizmetler"
        title="Markanın ihtiyacına göre"
        gradientText="net çözümler"
        description="Tek sayfalık bir vitrin yerine, her hizmet alanını ayrı hedef ve çıktı ile ele alıyoruz. Tasarım, metin ve geliştirme aynı büyüme amacına bağlanıyor."
        secondaryHref="/projects"
        secondaryLabel="Projeleri İncele"
      />

      <section className="relative pb-32">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            {details.map((service) => (
              <article
                key={service.id}
                id={service.id}
                className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md premium-border"
              >
                <div className="mb-8 flex items-start justify-between gap-6">
                  <div>
                    <span className="text-sm text-primary">/ {service.id}</span>
                    <h2 className="mt-3 text-3xl font-bold">{service.title}</h2>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-8 text-muted-foreground">{service.outcome}</p>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="border-t border-border/40 pt-3 text-sm text-foreground/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border/50 bg-background/40 p-8">
            <h2 className="text-2xl font-bold">Hızlı yönlendirme</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {services.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="rounded-full border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
