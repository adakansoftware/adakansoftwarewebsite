import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { defaultLocale, isLocale, localeHeaderName, stripLocalePrefix } from "@/lib/i18n"
import { getProxyRateLimitPolicy, isProxyRateLimited } from "@/lib/server/proxy-rate-limit"

const PUBLIC_FILE = /\.[^/]+$/

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown"
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Proxy-Cache", "bypass")
  return response
}

function applyApiBurstProtection(request: NextRequest) {
  const policy = getProxyRateLimitPolicy()
  const key = `${getClientIp(request)}:${request.nextUrl.pathname}`
  const now = Date.now()

  if (!isProxyRateLimited(key, now)) {
    return null
  }

  return NextResponse.json(
    { ok: false, error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(Math.ceil(policy.windowMs / 1000)),
      },
    },
  )
}

function forwardWithLocale(requestHeaders: Headers) {
  return withSecurityHeaders(
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }),
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    const limitedResponse = applyApiBurstProtection(request)
    if (limitedResponse) {
      return withSecurityHeaders(limitedResponse)
    }

    return withSecurityHeaders(NextResponse.next())
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return withSecurityHeaders(NextResponse.next())
  }

  const [, firstSegment] = pathname.split("/")
  const requestHeaders = new Headers(request.headers)

  if (firstSegment === defaultLocale) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = stripLocalePrefix(pathname)

    return withSecurityHeaders(NextResponse.redirect(redirectUrl))
  }

  if (isLocale(firstSegment)) {
    requestHeaders.set(localeHeaderName, firstSegment)
    return forwardWithLocale(requestHeaders)
  }

  requestHeaders.set(localeHeaderName, defaultLocale)
  return forwardWithLocale(requestHeaders)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
}
