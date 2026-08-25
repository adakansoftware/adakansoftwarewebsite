import Image from "next/image"
import Link from "next/link"

import { getOptimizedLogoImage } from "@/lib/project-image-assets"

export type PortfolioLogoWork = {
  title: string
  category: string
  description: string
  initials: string
  logoImage?: string
  color: string
}

export function PortfolioLogoCard({ work, href }: { work: PortfolioLogoWork; href?: string }) {
  const content = (
    <>
      <div
        className="relative mb-5 aspect-square overflow-hidden rounded-xl border border-white/10"
        style={{ background: `linear-gradient(135deg, ${work.color}24, transparent 52%, ${work.color}14)` }}
      >
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div className="absolute inset-6 flex items-center justify-center rounded-2xl border border-white/10 bg-background/35 backdrop-blur-md">
          {work.logoImage ? (
            <Image
              src={getOptimizedLogoImage(work.logoImage)}
              alt={`${work.title} logo`}
              width={320}
              height={180}
              className={`h-auto max-h-[72%] w-[82%] object-contain transition-transform duration-300 group-hover:scale-105 ${
                work.title === "Salihoğulları Hafriyat" ? "-translate-y-3" : ""
              }`}
            />
          ) : (
            <span
              className="font-aquire text-[clamp(2.8rem,8vw,4.8rem)] leading-none transition-transform duration-300 group-hover:scale-105"
              style={{ color: work.color }}
            >
              {work.initials}
            </span>
          )}
        </div>
        <div className="absolute right-4 bottom-4 h-2 w-16 rounded-full transition-transform duration-300 group-hover:scale-x-110" style={{ backgroundColor: work.color }} />
      </div>
      <p className="text-xs font-medium tracking-widest text-accent uppercase">{work.category}</p>
      <h3 className="mt-3 text-xl font-bold">{work.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{work.description}</p>
    </>
  )

  const className = "group block overflow-hidden rounded-2xl border border-border/50 bg-card/25 p-5 transition-colors hover:border-accent/45 premium-border"
  return href ? <Link href={href} className={className}>{content}</Link> : <article className={className}>{content}</article>
}
