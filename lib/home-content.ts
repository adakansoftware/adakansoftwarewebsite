import type { Locale } from "@/lib/i18n"

export const heroContent = {
  tr: {
    badge: "Mayıs 2026 için yeni proje görüşmeleri açık",
    lines: ["Markanı", "dijitalde", "büyüt"] as [string, string, string],
    description:
      "Web siteleri, marka kimlikleri ve kullanıcı deneyimleri tasarlıyoruz. Her ekran; güven, hız ve satış için birlikte çalışır.",
    primary: "Projeye Başla",
    secondary: "Projeleri Gör",
    scroll: "Kaydır",
    proofPoints: ["Strateji", "Web tasarım", "Marka kimliği", "Ürün arayüzü"],
  },
  en: {
    badge: "Now booking new projects for May 2026",
    lines: ["Grow", "digital", "brands"] as [string, string, string],
    description:
      "We design websites, brand identities, and user experiences. Every screen works together for trust, speed, and conversion.",
    primary: "Start a Project",
    secondary: "View Projects",
    scroll: "Scroll",
    proofPoints: ["Strategy", "Web design", "Brand identity", "Product UI"],
  },
} satisfies Record<
  Locale,
  {
    badge: string
    lines: [string, string, string]
    description: string
    primary: string
    secondary: string
    scroll: string
    proofPoints: string[]
  }
>

export const ctaContent = {
  tr: {
    title: "Markanı",
    gradient: "daha güçlü anlatalım",
    description:
      "Yeni web siteniz, marka kimliğiniz veya dijital ürününüz için net kapsam, doğru öncelik ve güçlü bir uygulama planı çıkaralım.",
    cta: "Görüşmeye Başla",
    stats: [
      { value: "4", label: "Ana hizmet alanı" },
      { value: "2-6", label: "Haftalık teslim planı" },
      { value: "100%", label: "Responsive yaklaşım" },
      { value: "TR/EN", label: "Çift dil hazırlığı" },
    ],
  },
  en: {
    title: "Let's tell",
    gradient: "your brand stronger",
    description:
      "For your new website, brand identity, or digital product, let's define the scope, priorities, and a strong execution plan.",
    cta: "Start the Conversation",
    stats: [
      { value: "4", label: "Core service areas" },
      { value: "2-6", label: "Week delivery plan" },
      { value: "100%", label: "Responsive approach" },
      { value: "TR/EN", label: "Bilingual readiness" },
    ],
  },
} satisfies Record<
  Locale,
  {
    title: string
    gradient: string
    description: string
    cta: string
    stats: Array<{ value: string; label: string }>
  }
>

export const testimonialsContent = {
  tr: {
    eyebrow: "Müşteri Yorumları",
    title: "İş ortaklarımızdan",
    gradient: "net geri bildirimler",
    prev: "Önceki yorum",
    next: "Sonraki yorum",
    goTo: (index: number) => `${index + 1}. yoruma git`,
    items: [
      {
        quote:
          "Adakan ekibi, dağınık ürün anlatımımızı çok net bir web deneyimine dönüştürdü. İlk ayda demo taleplerimizin kalitesi belirgin şekilde arttı.",
        author: "Ayşe Yılmaz",
        role: "CEO",
        company: "Nexus Finans",
      },
      {
        quote:
          "Sadece güzel bir arayüz değil, satış ekibimizin rahatça kullanabildiği güçlü bir iletişim sistemi teslim ettiler.",
        author: "Mehmet Kaya",
        role: "Kurucu",
        company: "Atlas Studio",
      },
      {
        quote:
          "Marka kimliğimiz daha güvenilir, web sitemiz daha anlaşılır hale geldi. Süreç boyunca neyin neden yapıldığını hep bildik.",
        author: "Elif Demir",
        role: "Operasyon Direktörü",
        company: "Vita Klinik",
      },
      {
        quote:
          "E-ticaret akışlarımız sadeleşti, ürün sayfaları daha iyi okunur hale geldi. Tasarım kararları doğrudan iş hedeflerine bağlandı.",
        author: "Can Öztürk",
        role: "E-ticaret Müdürü",
        company: "Mira Market",
      },
    ],
  },
  en: {
    eyebrow: "Testimonials",
    title: "Clear feedback",
    gradient: "from partners",
    prev: "Previous testimonial",
    next: "Next testimonial",
    goTo: (index: number) => `Go to testimonial ${index + 1}`,
    items: [
      {
        quote:
          "Adakan turned our scattered product story into a very clear web experience. The quality of demo requests improved noticeably in the first month.",
        author: "Ayse Yilmaz",
        role: "CEO",
        company: "Nexus Finance",
      },
      {
        quote:
          "They delivered not only a beautiful interface, but a strong communication system that our sales team can actually use.",
        author: "Mehmet Kaya",
        role: "Founder",
        company: "Atlas Studio",
      },
      {
        quote:
          "Our brand identity feels more trustworthy and our website is easier to understand. We always knew why each decision was made.",
        author: "Elif Demir",
        role: "Operations Director",
        company: "Vita Clinic",
      },
      {
        quote:
          "Our e-commerce flows became simpler and product pages easier to scan. Design decisions were tied directly to business goals.",
        author: "Can Ozturk",
        role: "E-commerce Manager",
        company: "Mira Market",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    eyebrow: string
    title: string
    gradient: string
    prev: string
    next: string
    goTo: (index: number) => string
    items: Array<{ quote: string; author: string; role: string; company: string }>
  }
>
