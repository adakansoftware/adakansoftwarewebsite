"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
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
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    intervalRef.current = setInterval(next, 8000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const variants = prefersReducedMotion
    ? {
        enter: { opacity: 1 },
        center: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        enter: (direction: number) => ({
          x: direction > 0 ? 60 : -60,
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
        },
        exit: (direction: number) => ({
          x: direction < 0 ? 60 : -60,
          opacity: 0,
        }),
      }

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block"
          >
            Müşteri Yorumları
          </motion.span>
          
          <motion.h2
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            İş ortaklarımızdan
            <br />
            <span className="text-gradient">net geri bildirimler</span>
          </motion.h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[280px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full text-center"
              >
                {/* Quote Icon */}
                <Quote className="w-10 h-10 mx-auto mb-6 text-primary/30" />

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed mb-10">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-foreground">
                      {testimonials[current].author.charAt(0)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {testimonials[current].author}
                  </p>
                  <p className="text-muted-foreground">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300"
              aria-label="Önceki yorum"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-2 mx-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1)
                    setCurrent(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`${index + 1}. yoruma git`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300"
              aria-label="Sonraki yorum"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
