import { getRequestLocale } from "@/lib/request-locale"
import { boundaryContent } from "@/lib/shell-content"

export default async function Loading() {
  const locale = await getRequestLocale()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.76_0.13_174_/_0.14),transparent_70%)]" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 rounded-full border border-primary/30" />
          <span className="absolute inset-2 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Adakan Software</p>
          <p className="mt-2 text-sm text-muted-foreground">{boundaryContent.loading[locale]}</p>
        </div>
      </div>
    </div>
  )
}
