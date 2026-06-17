import { NextResponse } from "next/server"
import { z } from "zod"

import { siteConfig } from "@/lib/site-config"

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(40).optional(),
  project: z.string().trim().min(10).max(4000),
  locale: z.enum(["tr", "en"]).optional(),
  website: z.string().max(0).optional(),
})

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 4
const requestTimestampsByIp = new Map<string, number[]>()

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown"
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

function isRateLimited(ip: string, now: number) {
  const recentTimestamps = (requestTimestampsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  recentTimestamps.push(now)
  requestTimestampsByIp.set(ip, recentTimestamps)

  return recentTimestamps.length > RATE_LIMIT_MAX_REQUESTS
}

export async function POST(request: Request) {
  const now = Date.now()
  const clientIp = getClientIp(request)

  if (isRateLimited(clientIp, now)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }

  if (result.data.website) {
    return NextResponse.json({ ok: true })
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

  let response: Response

  try {
    response = await fetch("https://api.resend.com/emails", {
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
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    return NextResponse.json({ ok: false, error: "Email service unavailable" }, { status: 502 })
  }

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
