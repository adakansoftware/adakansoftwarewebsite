import { randomUUID } from "node:crypto"

import { NextResponse } from "next/server"

import { siteConfig } from "@/lib/site-config"

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"])

function normalizeConfiguredOrigin(origin: string) {
  try {
    return new URL(origin).origin
  } catch {
    return null
  }
}

export function createRequestId(request: Request) {
  const incomingId = request.headers.get("x-request-id")?.trim()
  if (incomingId && incomingId.length <= 120) {
    return incomingId
  }

  return randomUUID()
}

export function jsonResponse(
  body: Record<string, unknown>,
  {
    status = 200,
    requestId,
    headers,
  }: {
    status?: number
    requestId: string
    headers?: HeadersInit
  },
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
      ...headers,
    },
  })
}

export function emptyResponse({
  status,
  requestId,
  headers,
}: {
  status: number
  requestId: string
  headers?: HeadersInit
}) {
  return new NextResponse(null, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
      ...headers,
    },
  })
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown"
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

export function isAuthorizedAdminRequest(request: Request) {
  const configuredKey = process.env.CONTACT_ADMIN_KEY?.trim()
  if (!configuredKey) {
    return false
  }

  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim()
  const adminKey = request.headers.get("x-contact-admin-key")?.trim()

  return bearerToken === configuredKey || adminKey === configuredKey
}

export function isAllowedOrigin(request: Request) {
  const originHeader = request.headers.get("origin")
  if (!originHeader) {
    return true
  }

  let origin: URL
  try {
    origin = new URL(originHeader)
  } catch {
    return false
  }

  const configuredOrigins = [siteConfig.url, process.env.NEXT_PUBLIC_SITE_URL]
    .map((value) => (value ? normalizeConfiguredOrigin(value) : null))
    .filter((value): value is string => Boolean(value))

  if (configuredOrigins.includes(origin.origin)) {
    return true
  }

  if (process.env.NODE_ENV !== "production" && LOOPBACK_HOSTS.has(origin.hostname)) {
    return true
  }

  return false
}

export function getContentLength(request: Request) {
  const rawValue = request.headers.get("content-length")
  if (!rawValue) {
    return null
  }

  const parsed = Number.parseInt(rawValue, 10)
  return Number.isFinite(parsed) ? parsed : null
}
