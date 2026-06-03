"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  project: z.string().min(10),
})

type FormValues = z.infer<typeof formSchema>

const copy = {
  tr: {
    name: "Ad Soyad",
    email: "E-posta",
    project: "Projen hakkında kısaca yaz",
    submit: "Gönder",
    sending: "Gönderiliyor...",
    success: "Mesajın ulaştı, en kısa sürede dönüş yapacağız.",
    namePlaceholder: "Adın Soyadın",
    emailPlaceholder: "email@ornek.com",
    projectPlaceholder: "Hangi hizmet, ne zaman, ne bekliyorsun...",
    errors: {
      name: "En az 2 karakter",
      email: "Geçerli bir e-posta gir",
      project: "En az 10 karakter",
    },
  },
  en: {
    name: "Full Name",
    email: "Email",
    project: "Tell us about your project",
    submit: "Send",
    sending: "Sending...",
    success: "Message received. We will get back to you shortly.",
    namePlaceholder: "Your Name",
    emailPlaceholder: "email@example.com",
    projectPlaceholder: "Which service, timeline, what you need...",
    errors: {
      name: "At least 2 characters",
      email: "Enter a valid email",
      project: "At least 10 characters",
    },
  },
} as const satisfies Record<
  Locale,
  {
    name: string
    email: string
    project: string
    submit: string
    sending: string
    success: string
    namePlaceholder: string
    emailPlaceholder: string
    projectPlaceholder: string
    errors: { name: string; email: string; project: string }
  }
>

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    const subject = encodeURIComponent(locale === "tr" ? "Yeni proje görüşmesi" : "New project inquiry")
    const body = encodeURIComponent(`${t.name}: ${data.name}\n${t.email}: ${data.email}\n\n${data.project}`)
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          className="flex flex-col items-center gap-4 py-12 text-center"
        >
          <CheckCircle className="h-12 w-12 text-accent" />
          <p className="text-lg text-foreground">{t.success}</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">{t.name}</Label>
              <Input
                id="contact-name"
                placeholder={t.namePlaceholder}
                {...register("name")}
                className="rounded-xl border-border/50 bg-card/20 backdrop-blur-sm focus:border-accent/60"
              />
              {errors.name ? <p className="text-xs text-destructive">{t.errors.name}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">{t.email}</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder={t.emailPlaceholder}
                {...register("email")}
                className="rounded-xl border-border/50 bg-card/20 backdrop-blur-sm focus:border-accent/60"
              />
              {errors.email ? <p className="text-xs text-destructive">{t.errors.email}</p> : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-project">{t.project}</Label>
            <Textarea
              id="contact-project"
              rows={5}
              placeholder={t.projectPlaceholder}
              {...register("project")}
              className="resize-none rounded-xl border-border/50 bg-card/20 backdrop-blur-sm focus:border-accent/60"
            />
            {errors.project ? <p className="text-xs text-destructive">{t.errors.project}</p> : null}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full rounded-full bg-accent py-7 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60 sm:w-auto sm:px-10"
          >
            {isSubmitting ? t.sending : t.submit}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
