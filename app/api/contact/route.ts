import { NextResponse } from "next/server"
import { z } from "zod"

import { siteConfig } from "@/lib/site-config"

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(40).optional(),
  project: z.string().trim().min(10).max(4000),
  locale: z.enum(["tr", "en"]).optional(),
})

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown"
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

function isRateLimited(key: string) {
  const now = Date.now()

  for (const [entryKey, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(entryKey)
    }
  }

  const current = rateLimitStore.get(key)
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  current.count += 1
  return false
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }

  if (typeof body === "object" && body !== null && "website" in body) {
    const website = body.website

    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ ok: true })
    }
  }

  const clientIp = getClientIp(request)
  if (isRateLimited(clientIp)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }

  const result = contactSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }

  const { name, email, phone, project, locale = "tr" } = result.data
  const resendApiKey = process.env.RESEND_API_KEY
  const fromDomain = process.env.RESEND_FROM_DOMAIN ?? "resend.dev"
  const fromAddress = fromDomain === "resend.dev" ? "Adakan Software <onboarding@resend.dev>" : `Adakan Software Website <noreply@${fromDomain}>`

  if (!resendApiKey || resendApiKey === "re_your_key_here") {
    return NextResponse.json({ ok: true })
  }

  const subject = locale === "tr" ? "Yeni proje görüşmesi" : "New project inquiry"
  const text = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone?.trim() || "-"}`, "", "Project:", project].join("\n")

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [siteConfig.email],
      reply_to: email,
      subject,
      text,
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
