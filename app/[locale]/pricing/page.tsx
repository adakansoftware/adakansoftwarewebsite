import { notFound } from "next/navigation"

import { PageHeader } from "@/components/page-header"
import { PricingSection } from "@/components/pricing-section"
import { isLocale } from "@/lib/i18n"
import { createPageMetadata } from "@/lib/metadata"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return createPageMetadata({ locale, title: "Pricing", description: "Starting price ranges for web, brand identity, and digital product projects.", path: "/pricing" })
}

export default async function LocalizedPricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <><PageHeader locale={locale} title="Clear scope," gradientText="clear investment" description="Choose the right starting point and let’s define your project scope together." /><PricingSection locale={locale} /></>
}
