"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { Github, Twitter, Linkedin, Instagram, ArrowUpRight } from "lucide-react"
import { MagneticButton } from "@/components/magnetic-button"

const footerLinks = {
  company: [
    { name: "Hakkımızda", href: "#" },
    { name: "Kariyer", href: "#" },
    { name: "Blog", href: "#" },
    { name: "İletişim", href: "#" },
  ],
  services: [
    { name: "Web Tasarım", href: "#" },
    { name: "Marka Kimliği", href: "#" },
    { name: "UI/UX Tasarım", href: "#" },
    { name: "Frontend Geliştirme", href: "#" },
  ],
}

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

export function Footer() {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <footer className="py-16 border-t border-border/30 relative">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <a href="#" className="mb-6 inline-flex items-center" aria-label="Adakan Software ana sayfa">
              <Image
                src="/adakan-logo.png"
                alt="Adakan Software"
                width={180}
                height={118}
                className="h-16 w-auto drop-shadow-[0_0_24px_rgba(45,212,191,0.18)]"
              />
            </a>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Büyümek isteyen markalar için stratejik web siteleri, marka kimlikleri ve dijital ürün arayüzleri üreten tasarım ve yazılım stüdyosu.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <MagneticButton key={social.label} strength={0.2}>
                  <a
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-muted-foreground" />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Şirket</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Hizmetler</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Adakan Software. Tüm hakları saklıdır.
          </p>
          
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gizlilik
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Kullanım Şartları
            </a>
            <span className="text-sm text-muted-foreground">
              İstanbul, Türkiye
            </span>
          </div>
        </div>

        {/* Large Background Text */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[12vw] font-bold text-border/[0.02] tracking-tighter leading-none whitespace-nowrap"
          >
            ADAKAN
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
