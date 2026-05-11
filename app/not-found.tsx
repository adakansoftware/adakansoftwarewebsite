import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/50 bg-card/30 p-8 text-center backdrop-blur-xl md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Aradığın sayfa bulunamadı</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Route artık yok olabilir ya da bağlantı eksik olabilir. Akışı ana sayfadan tekrar kurabiliriz.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Ana sayfaya dön
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-border/50 px-7 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            İletişime geç
          </Link>
        </div>
      </div>
    </div>
  )
}
