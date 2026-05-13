"use client"

import { Github, Instagram, Linkedin, Twitter } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"

const socialIcons = {
  GitHub: Github,
  X: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
} as const

type SocialLink = {
  label: keyof typeof socialIcons
  href: string
}

export function FooterSocialLinks({ links }: { links: readonly SocialLink[] }) {
  return (
    <div className="flex gap-3">
      {links.map((social) => {
        const Icon = socialIcons[social.label]

        return (
          <MagneticButton key={social.label} strength={0.2}>
            <a
              href={social.href}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5"
              aria-label={social.label}
              target="_blank"
              rel="noreferrer"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
            </a>
          </MagneticButton>
        )
      })}
    </div>
  )
}
