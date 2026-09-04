import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"

import { NextResponse } from "next/server"

import { getTrustedClientIp } from "@/lib/server/client-ip"
import { getContactStateStore } from "@/lib/server/contact-state-store"
import { isAllowedOrigin } from "@/lib/server/origin"
import { hasMinimumSecretLength } from "@/lib/server/secret-policy"

const SIGNED_ADMIN_TOLERANCE_MS = 5 * 60_000

function matchesSecret(candidate: string | null | undefined, secret: string | undefined) {
  if (!candidate || !secret) return false

  const candidateBuffer = Buffer.from(candidate)
  const secretBuffer = Buffer.from(secret)
  return candidateBuffer.length === secretBuffer.length && timingSafeEqual(candidateBuffer, secretBuffer)
}


export function createRequestId(request: Request) {
  const incomingId = request.headers.get("x-request-id")?.trim()
  if (incomingId && incomingId.length <= 120) {
    return incomingId
  }

  return randomUUID()
}

export function jsonResponse(
  body: unknown,
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

export function optionsResponse(requestId: string, allow: string) {
  return emptyResponse({
    status: 204,
    requestId,
    headers: {
      Allow: allow,
    },
  })
}

export function methodNotAllowedResponse(requestId: string, allow: string) {
  return jsonResponse(
    { ok: false, error: "Method not allowed" },
    {
      status: 405,
      requestId,
      headers: {
        Allow: allow,
      },
    },
  )
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
  const signingSecret = process.env.CONTACT_ADMIN_SIGNING_SECRET
  return process.env.NODE_ENV === "production"
    ? hasMinimumSecretLength(signingSecret)
    : Boolean(signingSecret?.trim())
}

export function hasSignedAdminNonceProtection() {
  return hasSignedAdminProtection()
}

export function isAuthorizedCronRequest(request: Request) {
  const configuredSecret = process.env.CONTACT_CRON_SECRET?.trim() || process.env.CRON_SECRET?.trim()
  if (!configuredSecret || (process.env.NODE_ENV === "production" && !hasMinimumSecretLength(configuredSecret))) {
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

  if (process.env.NODE_ENV !== "production" && (matchesSecret(bearerToken, configuredKey) || matchesSecret(adminKey, configuredKey))) {
    return true
  }

  const signingSecret = process.env.CONTACT_ADMIN_SIGNING_SECRET?.trim()
  const signature = request.headers.get("x-admin-signature")?.trim()
  const payload = getSignedAdminPayload(request)
  if (
    !signingSecret
    || (process.env.NODE_ENV === "production" && !hasMinimumSecretLength(signingSecret))
    || !signature
    || !payload
    || !hasFreshSignedAdminTimestamp(request)
  ) {
    return false
  }

  const expectedSignature = createHmac("sha256", signingSecret).update(payload).digest("hex")
  const providedSignature = Buffer.from(signature)
  const expectedSignatureBuffer = Buffer.from(expectedSignature)

  return providedSignature.length === expectedSignatureBuffer.length
    && timingSafeEqual(providedSignature, expectedSignatureBuffer)
    && await consumeSignedAdminNonce(request)
}

export { isAllowedOrigin }

export function getContentLength(request: Request) {
  const rawValue = request.headers.get("content-length")
  if (!rawValue) {
    return null
  }

  const normalized = rawValue.trim()
  if (!/^\d+$/.test(normalized)) {
    return -1
  }

  const parsed = Number(normalized)
  return Number.isSafeInteger(parsed) ? parsed : -1
}
