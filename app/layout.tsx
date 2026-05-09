import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AnimatedBackground } from '@/components/animated-background'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-display'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://adakansoftware.com'),
  title: {
    default: 'Adakan Software | Premium Web Tasarım ve Marka Ajansı',
    template: '%s | Adakan Software',
  },
  description: 'Adakan Software; premium web tasarım, logo, marka kimliği ve dönüşüm odaklı dijital ürün arayüzleri üreten futuristik yaratıcı ajans.',
  keywords: [
    'Adakan Software',
    'premium web tasarım',
    'logo tasarım',
    'marka kimliği',
    'web tasarım ajansı',
    'Next.js web sitesi',
    'UI UX tasarım',
  ],
  applicationName: 'Adakan Software',
  authors: [{ name: 'Adakan Software' }],
  creator: 'Adakan Software',
  publisher: 'Adakan Software',
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
    url: '/',
    siteName: 'Adakan Software',
    title: 'Adakan Software | Premium Web Tasarım ve Marka Ajansı',
    description: 'Premium web tasarım, marka kimliği ve conversion odaklı dijital ürün deneyimleri.',
    images: [
      {
        url: '/adakan-logo.png',
        width: 1600,
        height: 1200,
        alt: 'Adakan Software logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adakan Software | Premium Web Tasarım ve Marka Ajansı',
    description: 'Futuristik web tasarım, marka kimliği ve dijital ürün arayüzleri.',
    images: ['/adakan-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="bg-background">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <SmoothScrollProvider>
          <AnimatedBackground />
          <Navbar />
          <main className="relative">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </SmoothScrollProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
