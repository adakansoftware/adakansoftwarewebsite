import { NextResponse } from "next/server"

import { isAdmin } from "@/lib/admin-auth"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 })
  return NextResponse.json({ ok: true, email: process.env.ADMIN_EMAIL })
}
