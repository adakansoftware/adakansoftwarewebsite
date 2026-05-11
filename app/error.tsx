"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { getLocaleFromPathname, withLocale } from "@/lib/i18n"

const errorCopy = {
  tr: {
    eyebrow: "Sistem hatası",
    title: "Beklenmeyen bir durum oluştu",
    description: "Deneyimi bozmadan hatayı izole ettik. Sayfayı yeniden denemek çoğu durumda yeterli olur.",
    retry: "Tekrar dene",
    home: "Ana sayfaya dön",
  },
  en: {
    eyebrow: "System error",
    title: "Something unexpected happened",
    description: "We isolated the issue without breaking the experience. Retrying the page is usually enough.",
    retry: "Try again",
    home: "Back to home",
  },
} as const

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const copy = errorCopy[locale]

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/50 bg-card/30 p-8 text-center backdrop-blur-xl md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">{copy.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">{copy.title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{copy.description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            {copy.retry}
          </button>
          <Link
            href={withLocale("/", locale)}
            className="rounded-full border border-border/50 px-7 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {copy.home}
          </Link>
        </div>
      </div>
    </div>
  )
}
