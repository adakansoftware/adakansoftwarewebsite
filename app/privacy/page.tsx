import { PageHeader } from "@/components/page-header"

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gizlilik"
        title="Veri kullanımında"
        gradientText="şeffaf yaklaşım"
        description="Bu sayfa, web sitesi üzerinden paylaşılan iletişim bilgilerinin nasıl ele alındığını özetler."
        primaryHref="/contact"
        primaryLabel="İletişime Geç"
      />
      <section className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-6 text-muted-foreground">
          <p>İletişim amacıyla paylaştığınız bilgiler yalnızca talebinize yanıt vermek ve proje görüşmesini yürütmek için kullanılır.</p>
          <p>Bilgileriniz üçüncü taraflarla satış veya reklam amacıyla paylaşılmaz. Resmi yükümlülükler dışında kişisel verileriniz korunur.</p>
          <p>Herhangi bir silme veya güncelleme talebi için merhaba@adakan.com.tr adresinden iletişime geçebilirsiniz.</p>
        </div>
      </section>
    </>
  )
}
