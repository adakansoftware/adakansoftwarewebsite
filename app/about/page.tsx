import { PageHeader } from "@/components/page-header"

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımızda"
        title="Tasarım ve yazılımı"
        gradientText="aynı masada topluyoruz"
        description="Adakan Software; büyümek isteyen markalar için stratejik web siteleri, marka kimlikleri ve dijital ürün arayüzleri üreten bir tasarım ve yazılım stüdyosudur."
        secondaryHref="/projects"
        secondaryLabel="Projeleri Gör"
      />
      <section className="relative pb-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {[
            ["Netlik", "Markanın ne anlattığını sadeleştirir, kullanıcıya ilk saniyede doğru sinyali veririz."],
            ["Zanaat", "Tipografi, boşluk, hız ve hareket detaylarını marka algısını güçlendirmek için kullanırız."],
            ["Süreklilik", "Teslim edilen işin yayından sonra da yönetilebilir ve geliştirilebilir kalmasını önemseriz."],
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
