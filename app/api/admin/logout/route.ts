import { NextResponse } from "next/server"

import { cookieName } from "@/lib/admin-auth"
import { getAdminSessionMutationRequestError } from "@/lib/admin-session-request"
import { isAllowedOrigin } from "@/lib/server/http"

export async function POST(request: Request) {
  const requestError = getAdminSessionMutationRequestError(request, isAllowedOrigin)
  if (requestError) {
    return NextResponse.json({ ok: false }, { status: requestError, headers: { "Cache-Control": "no-store" } })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(cookieName, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 })
  return response
}
