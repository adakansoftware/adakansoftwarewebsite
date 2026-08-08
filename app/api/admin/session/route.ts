import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!token || !url || !secret) return NextResponse.json({ ok: false }, { status: 401 })

  const { data, error } = await createClient(url, secret, { auth: { persistSession: false } }).auth.getUser(token)
  const email = data.user?.email?.toLowerCase()
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean)
  if (error || !email || (allowed.length > 0 && !allowed.includes(email))) return NextResponse.json({ ok: false }, { status: 403 })
  return NextResponse.json({ ok: true, email })
}
