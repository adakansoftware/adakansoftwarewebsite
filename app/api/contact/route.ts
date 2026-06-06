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

export async function POST(request: Request) {
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
