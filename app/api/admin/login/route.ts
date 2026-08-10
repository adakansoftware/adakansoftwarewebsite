import { NextResponse } from "next/server"
import { adminCookie, adminSessionMaxAgeSeconds, cookieName, hasAdminSessionConfiguration } from "@/lib/admin-auth"
import { getTrustedClientIp } from "@/lib/server/client-ip"
import {
  clearAdminLoginFailures,
  recordAdminLoginFailure,
  shouldRejectAdminLogin,
} from "@/lib/server/admin-login-rate-limit"

export async function POST(request: Request) {
  const clientIp = getTrustedClientIp(request.headers)
  const now = Date.now()

  if (await shouldRejectAdminLogin(clientIp, now)) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Cache-Control": "no-store" } })
  }

  if (!hasAdminSessionConfiguration()) {
    return NextResponse.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }

  let credentials: { email?: string; password?: string }
  try {
    credentials = await request.json() as { email?: string; password?: string }
  } catch {
    await recordAdminLoginFailure(clientIp, now)
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const { email, password } = credentials
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    await recordAdminLoginFailure(clientIp, now)
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  await clearAdminLoginFailures(clientIp)
  const response = NextResponse.json({ ok: true, email })
  response.cookies.set(cookieName, adminCookie(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: adminSessionMaxAgeSeconds })
  return response
}
