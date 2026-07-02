import {
  deliverContactMessage,
  getContactContentLengthLimit,
  isContactDeliveryConfigured,
  isDuplicateSubmission,
  isRateLimited,
  parseContactPayload,
} from "@/lib/server/contact-service"
import {
  createRequestId,
  emptyResponse,
  getClientIp,
  getContentLength,
  isAllowedOrigin,
  jsonResponse,
} from "@/lib/server/http"

export const runtime = "nodejs"

const ALLOW_HEADER_VALUE = "POST, OPTIONS"

export async function OPTIONS(request: Request) {
  const requestId = createRequestId(request)

  return emptyResponse({
    status: 204,
    requestId,
    headers: {
      Allow: ALLOW_HEADER_VALUE,
    },
  })
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)

  return jsonResponse(
    { ok: false, error: "Method not allowed" },
    {
      status: 405,
      requestId,
      headers: {
        Allow: ALLOW_HEADER_VALUE,
      },
    },
  )
}

export async function POST(request: Request) {
  const requestId = createRequestId(request)
  const now = Date.now()
  const clientIp = getClientIp(request)

  if (!isAllowedOrigin(request)) {
    return jsonResponse({ ok: false, error: "Origin not allowed" }, { status: 403, requestId })
  }

  const contentLength = getContentLength(request)
  if (contentLength !== null && contentLength > getContactContentLengthLimit()) {
    return jsonResponse({ ok: false, error: "Payload too large" }, { status: 413, requestId })
  }

  if (isRateLimited(clientIp, now)) {
    return jsonResponse(
      { ok: false, error: "Too many requests" },
      {
        status: 429,
        requestId,
        headers: {
          "Retry-After": "60",
        },
      },
    )
  }

  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    return jsonResponse({ ok: false, error: "Invalid request" }, { status: 400, requestId })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: "Invalid request" }, { status: 400, requestId })
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.trim().length > 0
  ) {
    return jsonResponse({ ok: true, accepted: true }, { requestId })
  }

  const submission = parseContactPayload(body)
  if (!submission) {
    return jsonResponse({ ok: false, error: "Invalid request" }, { status: 400, requestId })
  }

  if (isDuplicateSubmission(submission, clientIp, now)) {
    return jsonResponse({ ok: true, accepted: true, duplicate: true }, { requestId })
  }

  try {
    const result = await deliverContactMessage(submission)

    if (!result.ok) {
      console.error("[contact-api] upstream-delivery-rejected", {
        requestId,
        clientIp,
      })

      return jsonResponse({ ok: false, error: "Email delivery failed" }, { status: 502, requestId })
    }

    return jsonResponse(
      {
        ok: true,
        accepted: true,
        deliveryConfigured: isContactDeliveryConfigured(),
        duplicate: false,
        skippedDelivery: result.skipped,
      },
      { requestId },
    )
  } catch (error) {
    console.error("[contact-api] delivery-failed", {
      requestId,
      clientIp,
      error: error instanceof Error ? error.message : "unknown-error",
    })

    return jsonResponse({ ok: false, error: "Email service unavailable" }, { status: 502, requestId })
  }
}
