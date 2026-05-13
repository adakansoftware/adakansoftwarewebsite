import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { AnimatedBackground } from "@/components/animated-background"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getRequestLocale } from "@/lib/request-locale"
import { rootMetadataCopy, siteConfig } from "@/lib/site-config"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
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
        url: siteConfig.defaultOgImage,
        width: 1600,
        height: 1200,
        alt: `${siteConfig.name} logo`,
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
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <SmoothScrollProvider>
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
        </SmoothScrollProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
