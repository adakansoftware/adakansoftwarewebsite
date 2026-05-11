import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { defaultLocale, isLocale, localeHeaderName, stripLocalePrefix } from "@/lib/i18n"

const PUBLIC_FILE = /\.[^/]+$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const [, firstSegment] = pathname.split("/")
  const requestHeaders = new Headers(request.headers)

  if (firstSegment === defaultLocale) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = stripLocalePrefix(pathname)

    return NextResponse.redirect(redirectUrl)
  }

  if (isLocale(firstSegment)) {
    requestHeaders.set(localeHeaderName, firstSegment)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
}
