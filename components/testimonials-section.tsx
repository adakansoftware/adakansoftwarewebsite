"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import type { Locale } from "@/lib/i18n"

const copy = {
  tr: {
    eyebrow: "Müşteri Yorumları",
    title: "İş ortaklarımızdan",
    gradient: "net geri bildirimler",
    prev: "Önceki yorum",
    next: "Sonraki yorum",
    goTo: (index: number) => `${index + 1}. yoruma git`,
    testimonials: [
      {
        quote: "Adakan ekibi, dağınık ürün anlatımızı çok net bir web deneyimine dönüştürdü. İlk ayda demo taleplerimizin kalitesi belirgin şekilde arttı.",
        author: "Ayşe Yılmaz",
        role: "CEO",
        company: "Nexus Finans",
      },
      {
        quote: "Sadece güzel bir arayüz değil, satış ekibimizin rahatça kullanabildiği güçlü bir iletişim sistemi teslim ettiler.",
        author: "Mehmet Kaya",
        role: "Kurucu",
        company: "Atlas Studio",
      },
      {
        quote: "Marka kimliğimiz daha güvenilir, web sitemiz daha anlaşılır hale geldi. Süreç boyunca neyin neden yapıldığını hep bildik.",
        author: "Elif Demir",
        role: "Operasyon Direktörü",
        company: "Vita Klinik",
      },
      {
        quote: "E-ticaret akışlarımız sadeleşti, ürün sayfaları daha iyi okunur hale geldi. Tasarım kararları doğrudan iş hedeflerine bağlandı.",
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
    testimonials: [
      {
        quote: "Adakan turned our scattered product story into a very clear web experience. The quality of demo requests improved noticeably in the first month.",
        author: "Ayse Yilmaz",
        role: "CEO",
        company: "Nexus Finance",
      },
      {
        quote: "They delivered not only a beautiful interface, but a strong communication system that our sales team can actually use.",
        author: "Mehmet Kaya",
        role: "Founder",
        company: "Atlas Studio",
      },
      {
        quote: "Our brand identity feels more trustworthy and our website is easier to understand. We always knew why each decision was made.",
        author: "Elif Demir",
        role: "Operations Director",
        company: "Vita Clinic",
      },
      {
        quote: "Our e-commerce flows became simpler and product pages easier to scan. Design decisions were tied directly to business goals.",
        author: "Can Ozturk",
        role: "E-commerce Manager",
        company: "Mira Market",
      },
    ],
  },
} satisfies Record<Locale, {
  eyebrow: string
  title: string
  gradient: string
  prev: string
  next: string
  goTo: (index: number) => string
  testimonials: Array<{ quote: string; author: string; role: string; company: string }>
}>

export function TestimonialsSection({ locale = "tr" }: { locale?: Locale }) {
  const sectionCopy = copy[locale]
  const testimonials = sectionCopy.testimonials
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!document.hidden) {
        setDirection(1)
        setCurrent((prev) => (prev + 1) % testimonials.length)
      }
    }, 8000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [testimonials.length])

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 60 : -60, opacity: 0 }),
  }

  return (
    <section id="testimonials" className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block"
          >
            {sectionCopy.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            {sectionCopy.title}
            <br />
            <span className="text-gradient">{sectionCopy.gradient}</span>
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative flex min-h-[430px] items-center justify-center sm:min-h-[360px] md:min-h-[300px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute w-full text-center"
              >
                <Quote className="w-10 h-10 mx-auto mb-6 text-primary/30" />
                <blockquote className="mb-8 text-lg font-medium leading-relaxed text-foreground md:mb-10 md:text-2xl lg:text-3xl">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-foreground">{testimonials[current].author.charAt(0)}</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{testimonials[current].author}</p>
                  <p className="text-muted-foreground">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300"
              aria-label={sectionCopy.prev}
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex gap-2 mx-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1)
                    setCurrent(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`}
                  aria-label={sectionCopy.goTo(index)}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300"
              aria-label={sectionCopy.next}
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
