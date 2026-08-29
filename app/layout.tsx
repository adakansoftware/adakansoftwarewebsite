import type { Metadata, Viewport } from "next"
import { Inter, Sora, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { AnimatedBackground } from "@/components/animated-background"
import { ClientShell } from "@/components/client-shell"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { Navbar } from "@/components/navbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getRequestLocale } from "@/lib/request-locale"
import { rootMetadataCopy, siteConfig } from "@/lib/site-config"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-hero-accent",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: rootMetadataCopy.tr.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: rootMetadataCopy.tr.description,
  keywords: rootMetadataCopy.tr.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: siteConfig.name,
    title: rootMetadataCopy.tr.title,
    description: rootMetadataCopy.tr.openGraphDescription,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Premium Web Tasarımı ve Marka Ajansı`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: rootMetadataCopy.tr.title,
    description: rootMetadataCopy.tr.twitterDescription,
    images: [siteConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getRequestLocale()
  const skipLinkLabel = locale === "tr" ? "İçeriğe geç" : "Skip to content"

  return (
    <html lang={locale} className="bg-background">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} font-sans antialiased`}>
        <ClientShell />
        <JsonLd locale={locale} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[4000] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          {skipLinkLabel}
        </a>
        <AnimatedBackground />
        <Navbar locale={locale} />
        <main id="main-content" className="relative">
          {children}
        </main>
        <Footer locale={locale} />
        <WhatsAppButton locale={locale} />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
