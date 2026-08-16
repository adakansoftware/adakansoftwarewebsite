"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getContactDeliveryState, type ContactDeliveryState } from "@/lib/contact-submission-feedback"
import type { Locale } from "@/lib/i18n"

const formSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(40).optional(),
  project: z.string().trim().min(10).max(4000),
  website: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const copy = {
  tr: {
    name: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    project: "Projen hakkında kısaca yaz",
    submit: "Gönder",
    sending: "Gönderiliyor...",
    success: "Mesajın ulaştı, en kısa sürede dönüş yapacağız.",
    deliveryPending: "Talebin alındı. E-posta teslimatı sırada; en kısa sürede dönüş yapacağız.",
    sendAnother: "Yeni talep gönder",
    error: "Mesaj gönderilemedi. Lütfen tekrar dene veya e-posta ile ulaş.",
    namePlaceholder: "Adın Soyadın",
    emailPlaceholder: "email@ornek.com",
    phonePlaceholder: "05xx xxx xx xx",
    projectPlaceholder: "Hangi hizmet, ne zaman, ne bekliyorsun...",
    errors: {
      name: "En az 2 karakter",
      email: "Geçerli bir e-posta gir",
      project: "En az 10 karakter",
    },
    rateLimited: "Çok sık deneme algılandı. Lütfen kısa bir süre sonra tekrar deneyin.",
  },
  en: {
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    project: "Tell us about your project",
    submit: "Send",
    sending: "Sending...",
    success: "Message received. We will get back to you shortly.",
    deliveryPending: "Your request was received. Email delivery is queued and we will get back to you shortly.",
    sendAnother: "Send another request",
    error: "Message could not be sent. Please try again or contact us by email.",
    namePlaceholder: "Your Name",
    emailPlaceholder: "email@example.com",
    phonePlaceholder: "+90 5xx xxx xx xx",
    projectPlaceholder: "Which service, timeline, what you need...",
    errors: {
      name: "At least 2 characters",
      email: "Enter a valid email",
      project: "At least 10 characters",
    },
    rateLimited: "Too many attempts detected. Please try again shortly.",
  },
} as const satisfies Record<
  Locale,
  {
    name: string
    email: string
    phone: string
    project: string
    submit: string
    sending: string
    success: string
    deliveryPending: string
    sendAnother: string
    error: string
    namePlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    projectPlaceholder: string
    errors: { name: string; email: string; project: string }
    rateLimited: string
  }
>

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const formId = useId()
  const [deliveryState, setDeliveryState] = useState<ContactDeliveryState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      })

      const result = getContactDeliveryState(await response.json())
      if (!response.ok || !result) {
        throw new Error(response.status === 429 ? "rate-limited" : "contact-request-failed")
      }

      reset({ name: "", email: "", phone: "", project: "", website: "" })
      setDeliveryState(result)
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message === "rate-limited"
          ? t.rateLimited
          : t.error,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {deliveryState ? (
        <motion.div
          key="success"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          className="flex flex-col items-center gap-4 py-12 text-center"
        >
          <CheckCircle className="h-12 w-12 text-accent" />
          <p aria-live="polite" className="text-lg text-foreground">{deliveryState === "pending" ? t.deliveryPending : t.success}</p>
          <Button variant="outline" onClick={() => setDeliveryState(null)}>{t.sendAnother}</Button>
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
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            {...register("website")}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">{t.name}</Label>
              <Input
                id="contact-name"
                placeholder={t.namePlaceholder}
                autoComplete="name"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                {...register("name")}
                className="rounded-xl border-border/50 bg-card/20 backdrop-blur-sm focus:border-accent/60"
              />
              {errors.name ? (
                <p id={`${formId}-name-error`} className="text-xs text-destructive">
                  {t.errors.name}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">{t.email}</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                {...register("email")}
                className="rounded-xl border-border/50 bg-card/20 backdrop-blur-sm focus:border-accent/60"
              />
              {errors.email ? (
                <p id={`${formId}-email-error`} className="text-xs text-destructive">
                  {t.errors.email}
                </p>
              ) : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contact-phone">{t.phone}</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder={t.phonePlaceholder}
                autoComplete="tel"
                {...register("phone")}
                className="rounded-xl border-border/50 bg-card/20 backdrop-blur-sm focus:border-accent/60"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-project">{t.project}</Label>
            <Textarea
              id="contact-project"
              rows={5}
              placeholder={t.projectPlaceholder}
              aria-invalid={errors.project ? "true" : "false"}
              aria-describedby={errors.project ? `${formId}-project-error` : undefined}
              {...register("project")}
              className="resize-none rounded-xl border-border/50 bg-card/20 backdrop-blur-sm focus:border-accent/60"
            />
            {errors.project ? (
              <p id={`${formId}-project-error`} className="text-xs text-destructive">
                {t.errors.project}
              </p>
            ) : null}
          </div>
          {submitError ? (
            <p role="alert" aria-live="polite" className="text-sm text-destructive">
              {submitError}
            </p>
          ) : null}
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
