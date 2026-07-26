import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"

import { NextResponse } from "next/server"

import { siteConfig } from "@/lib/site-config"
import { getTrustedClientIp } from "@/lib/server/client-ip"
import { getContactStateStore } from "@/lib/server/contact-state-store"

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"])
const SIGNED_ADMIN_TOLERANCE_MS = 5 * 60_000

function matchesSecret(candidate: string | null | undefined, secret: string | undefined) {
  if (!candidate || !secret) return false

  const candidateBuffer = Buffer.from(candidate)
  const secretBuffer = Buffer.from(secret)
  return candidateBuffer.length === secretBuffer.length && timingSafeEqual(candidateBuffer, secretBuffer)
}

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
  return getTrustedClientIp(request.headers)
}

function getSignedAdminPayload(request: Request) {
  const timestamp = request.headers.get("x-admin-timestamp")?.trim()
  if (!timestamp) {
    return null
  }

  const actor = request.headers.get("x-admin-actor")?.trim() || ""
  const reason = request.headers.get("x-replay-reason")?.trim() || ""
  const nonce = request.headers.get("x-admin-nonce")?.trim() || ""

  return `${request.method}\n${new URL(request.url).pathname}\n${timestamp}\n${actor}\n${reason}\n${nonce}`
}

async function consumeSignedAdminNonce(request: Request) {
  const nonce = request.headers.get("x-admin-nonce")?.trim()
  const timestamp = request.headers.get("x-admin-timestamp")?.trim()
  if (!nonce || !timestamp) {
    return false
  }

  const parsedTimestamp = Number.parseInt(timestamp, 10)
  if (!Number.isFinite(parsedTimestamp)) {
    return false
  }

  return getContactStateStore().consumeAdminNonce(nonce, parsedTimestamp + SIGNED_ADMIN_TOLERANCE_MS)
}

function hasFreshSignedAdminTimestamp(request: Request) {
  const timestamp = request.headers.get("x-admin-timestamp")?.trim()
  if (!timestamp) {
    return false
  }

  const parsedTimestamp = Number.parseInt(timestamp, 10)
  if (!Number.isFinite(parsedTimestamp)) {
    return false
  }

  return Math.abs(Date.now() - parsedTimestamp) <= SIGNED_ADMIN_TOLERANCE_MS
}

export function hasSignedAdminProtection() {
  return Boolean(process.env.CONTACT_ADMIN_SIGNING_SECRET?.trim())
}

export function hasSignedAdminNonceProtection() {
  return hasSignedAdminProtection()
}

export function isAuthorizedCronRequest(request: Request) {
  const configuredSecret = process.env.CONTACT_CRON_SECRET?.trim() || process.env.CRON_SECRET?.trim()
  if (!configuredSecret) {
    return false
  }

  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim()
  const cronSecret = request.headers.get("x-cron-secret")?.trim()

  return matchesSecret(bearerToken, configuredSecret) || matchesSecret(cronSecret, configuredSecret)
}

export async function isAuthorizedAdminRequest(request: Request) {
  const configuredKey = process.env.CONTACT_ADMIN_KEY?.trim()
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim()
  const adminKey = request.headers.get("x-contact-admin-key")?.trim()

  if (matchesSecret(bearerToken, configuredKey) || matchesSecret(adminKey, configuredKey)) {
    return true
  }

  const signingSecret = process.env.CONTACT_ADMIN_SIGNING_SECRET?.trim()
  const signature = request.headers.get("x-admin-signature")?.trim()
  const payload = getSignedAdminPayload(request)
  if (!signingSecret || !signature || !payload || !hasFreshSignedAdminTimestamp(request)) {
    return false
  }

  const expectedSignature = createHmac("sha256", signingSecret).update(payload).digest("hex")
  const providedSignature = Buffer.from(signature)
  const expectedSignatureBuffer = Buffer.from(expectedSignature)

  return providedSignature.length === expectedSignatureBuffer.length
    && timingSafeEqual(providedSignature, expectedSignatureBuffer)
    && await consumeSignedAdminNonce(request)
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
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : -1
}
