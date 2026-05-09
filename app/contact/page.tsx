import Link from "next/link"
import { ArrowRight, Mail, MapPin } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

const contactOptions = [
  {
    title: "E-posta",
    value: "merhaba@adakan.com.tr",
    href: "mailto:merhaba@adakan.com.tr",
    icon: Mail,
  },
  {
    title: "Konum",
    value: "İstanbul, Türkiye",
    href: "/about",
    icon: MapPin,
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="İletişim"
        title="Projeni"
        gradientText="birlikte netleştirelim"
        description="Yeni web siteniz, marka kimliğiniz veya dijital ürününüz için hedefleri, kapsamı ve ilk teslim planını birlikte çıkaralım."
        primaryHref="mailto:merhaba@adakan.com.tr"
        primaryLabel="E-posta Gönder"
        secondaryHref="/services"
        secondaryLabel="Hizmetleri Gör"
      />

      <section className="relative pb-32">
        <div className="section-shell grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md premium-border">
            <h2 className="text-3xl font-bold">Başlangıç için kısa not</h2>
            <p className="mt-4 text-muted-foreground">
              Mail atarken proje türünü, varsa mevcut web sitenizi, hedeflediğiniz teslim tarihini ve beklentinizi yazmanız yeterli.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Web sitesi", "Marka kimliği", "UI/UX", "Frontend geliştirme"].map((item) => (
                <span key={item} className="rounded-xl border border-border/50 bg-background/35 px-4 py-3 text-sm">
                  {item}
                </span>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8 rounded-full bg-foreground px-8 py-7 text-background hover:bg-foreground/90">
              <a href="mailto:merhaba@adakan.com.tr">
                merhaba@adakan.com.tr
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="space-y-4">
            {contactOptions.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/25 p-6 transition-colors hover:border-primary/50"
              >
                <option.icon className="h-5 w-5 text-primary" />
                <span>
                  <span className="block text-sm text-muted-foreground">{option.title}</span>
                  <span className="font-medium">{option.value}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
