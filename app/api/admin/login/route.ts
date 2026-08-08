import { NextResponse } from "next/server"
import { adminCookie, cookieName } from "@/lib/admin-auth"

export async function POST(request: Request) {
  let credentials: { email?: string; password?: string }
  try { credentials = await request.json() as { email?: string; password?: string } } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
  const { email, password } = credentials
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ ok: false }, { status: 401 })
  const response = NextResponse.json({ ok: true, email })
  response.cookies.set(cookieName, adminCookie(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" })
  return response
}
