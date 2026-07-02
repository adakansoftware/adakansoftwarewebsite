import type { Locale } from "@/lib/i18n"

export const whatsAppPhoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "905399416521"

export const whatsAppCopy = {
  tr: {
    label: "WhatsApp ile iletişime geç",
    text: "Merhaba, Adakan Software ile yeni bir proje hakkında görüşmek istiyorum.",
    short: "WhatsApp",
  },
  en: {
    label: "Contact us on WhatsApp",
    text: "Hello, I would like to talk with Adakan Software about a new project.",
    short: "WhatsApp",
  },
} satisfies Record<Locale, { label: string; text: string; short: string }>

export const inquirySubjectCopy = {
  tr: "Yeni proje görüşmesi",
  en: "New project inquiry",
} satisfies Record<Locale, string>

export function createMailtoHref(email: string, subject?: string) {
  if (!subject) {
    return `mailto:${email}`
  }

  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}

export function getInquiryMailto(email: string, locale: Locale) {
  return createMailtoHref(email, inquirySubjectCopy[locale])
}

export function getWhatsAppHref(locale: Locale) {
  return `https://wa.me/${whatsAppPhoneNumber}?text=${encodeURIComponent(whatsAppCopy[locale].text)}`
}
