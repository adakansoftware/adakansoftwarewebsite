import type { Locale } from "@/lib/i18n"

export const whatsAppPhoneNumber = "905399416521"

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

export function getWhatsAppHref(locale: Locale) {
  return `https://wa.me/${whatsAppPhoneNumber}?text=${encodeURIComponent(whatsAppCopy[locale].text)}`
}
