import { Instagram } from "lucide-react"
import type { ReactNode } from "react"

import { getWhatsAppHref, whatsAppCopy } from "@/lib/contact-links"
import type { Locale } from "@/lib/i18n"

const instagramHref = "https://www.instagram.com/adakansoftware"

export function WhatsAppButton({ locale }: { locale: Locale }) {
  const content = whatsAppCopy[locale]

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      <SocialBubble
        href={instagramHref}
        label="Instagram"
        tone="instagram"
        icon={<Instagram className="h-5 w-5" aria-hidden="true" />}
      />
      <SocialBubble
        href={getWhatsAppHref(locale)}
        label={content.short}
        ariaLabel={content.label}
        tone="whatsapp"
        icon={<WhatsAppMark />}
      />
    </div>
  )
}

function SocialBubble({
  href,
  label,
  ariaLabel = label,
  icon,
  tone,
}: {
  href: string
  label: string
  ariaLabel?: string
  icon: ReactNode
  tone: "whatsapp" | "instagram"
}) {
  const toneClass =
    tone === "instagram"
      ? "border-accent/35 text-accent hover:border-accent/70 hover:bg-accent hover:text-background hover:shadow-[0_0_34px_rgba(251,191,36,0.22)]"
      : "border-primary/35 text-primary hover:border-primary/70 hover:bg-primary hover:text-background hover:shadow-[0_0_34px_rgba(45,212,191,0.26)]"

  return (
    <div className="group relative">
      <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-full border border-border/50 bg-background/80 px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 md:block">
        {label}
      </span>
      <a
        href={href}
        aria-label={ariaLabel}
        target="_blank"
        rel="noreferrer"
        className={`relative grid h-12 w-12 place-items-center rounded-full border bg-background/72 shadow-[0_0_26px_rgba(45,212,191,0.12)] backdrop-blur-xl transition-[transform,border-color,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:h-14 md:w-14 ${toneClass}`}
      >
        <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="relative">{icon}</span>
      </a>
    </div>
  )
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6.8 25.7 8.1 21A10.4 10.4 0 1 1 12 24.8l-5.2.9Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M12.2 10.9c.3-.7.6-.7 1-.7h.7c.2 0 .5.1.7.5.2.5.8 1.9.9 2 .1.2.1.4 0 .6-.1.3-.2.4-.4.6l-.5.6c-.2.2-.3.4-.1.7.2.4.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.6 1.6.3.1.5.1.7-.2l.9-1.1c.2-.3.5-.3.8-.2.3.1 2 .9 2.3 1.1.4.2.6.3.6.5.1.2.1 1.2-.3 2.1-.4.9-2 1.7-2.8 1.8-.8.1-1.8.1-4-.8-3.4-1.3-5.7-4.8-5.9-5-.2-.3-1.4-1.9-1.4-3.6 0-1.7.8-2.5 1.2-2.9.3-.4.7-.5 1.2-.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
