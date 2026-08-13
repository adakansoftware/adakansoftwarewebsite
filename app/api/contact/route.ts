import { contactPolicy } from "@/lib/server/contact-policy"
import { isContactRuntimeConfigurationValid } from "@/lib/server/contact-runtime-config"
import { getContactStateStoreStatus } from "@/lib/server/contact-state-store"
import {
  createQueuedContactMessage,
  getIdempotencyReplay,
  markContactMessageDelivered,
  markContactMessageFailed,
  storeIdempotencyReplay,
} from "@/lib/server/contact-pipeline"
import {
  getContactContentLengthLimit,
  hasSpamTrapValue,
  isContactDeliveryConfigured,
  isDuplicateSubmission,
  isRateLimited,
  parseContactPayload,
  resendContactDelivery,
} from "@/lib/server/contact-service"
import {
  createRequestId,
  emptyResponse,
  getClientIp,
  getContentLength,
  isAllowedOrigin,
  jsonResponse,
} from "@/lib/server/http"
import { logServerEvent } from "@/lib/server/logger"
import { recordContactRequest } from "@/lib/contact-request-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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

  if (!isContactRuntimeConfigurationValid()) {
    return jsonResponse(
      { ok: false, error: "Contact service is unavailable" },
      { status: 503, requestId },
    )
  }

  // Production delivery relies on Redis for rate limiting, idempotency, and
  // the outbox. Fail closed with a clear service response instead of allowing
  // a later state-store operation to surface as an unhandled 500.
  if (process.env.NODE_ENV === "production") {
    try {
      const stateStatus = await getContactStateStoreStatus()
      if (!stateStatus.available) {
        logServerEvent("error", "contact.state.unavailable", {
          requestId,
          error: stateStatus.error,
        })
        return jsonResponse(
          { ok: false, error: "Contact service is unavailable" },
          { status: 503, requestId },
        )
      }
    } catch (error) {
      logServerEvent("error", "contact.state.check-failed", {
        requestId,
        error: error instanceof Error ? error.message : "unknown-error",
      })
      return jsonResponse(
        { ok: false, error: "Contact service is unavailable" },
        { status: 503, requestId },
      )
    }
  }

  if (!isAllowedOrigin(request)) {
    return jsonResponse({ ok: false, error: "Origin not allowed" }, { status: 403, requestId })
  }

  const contentLength = getContentLength(request)
  if (contentLength !== null && (contentLength < 0 || contentLength > getContactContentLengthLimit())) {
    return jsonResponse({ ok: false, error: "Payload too large" }, { status: 413, requestId })
  }

  if (await isRateLimited(clientIp, now)) {
    return jsonResponse(
      { ok: false, error: "Too many requests" },
      {
        status: 429,
        requestId,
        headers: {
          "Retry-After": String(Math.ceil(contactPolicy.rateLimitWindowMs / 1000)),
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
    const rawBody = await request.text()
    if (new TextEncoder().encode(rawBody).byteLength > getContactContentLengthLimit()) {
      return jsonResponse({ ok: false, error: "Payload too large" }, { status: 413, requestId })
    }

    body = JSON.parse(rawBody) as unknown
  } catch {
    return jsonResponse({ ok: false, error: "Invalid request" }, { status: 400, requestId })
  }

  if (hasSpamTrapValue(body)) {
    return jsonResponse({ ok: true, accepted: true }, { requestId })
  }

  const submission = parseContactPayload(body)
  if (!submission) {
    return jsonResponse({ ok: false, error: "Invalid request" }, { status: 400, requestId })
  }

  const replay = await getIdempotencyReplay(request, submission, now)
  if (replay?.conflict) {
    return jsonResponse({ ok: false, error: "Idempotency conflict" }, { status: 409, requestId })
  }

  if (replay && !replay.conflict && replay.pending) {
    return jsonResponse({ ok: false, error: "Idempotency request in progress" }, { status: 409, requestId })
  }

  if (replay && !replay.conflict && !replay.pending) {
    return jsonResponse(replay.body, { status: replay.status, requestId })
  }

  if (await isDuplicateSubmission(submission, clientIp, now)) {
    const duplicateResponse = {
      ok: true,
      accepted: true,
      duplicate: true,
      deliveryConfigured: isContactDeliveryConfigured(),
      skippedDelivery: true,
      queued: false,
    }

    await storeIdempotencyReplay(request, submission, {
      status: 200,
      body: duplicateResponse,
    })

    return jsonResponse(duplicateResponse, { requestId })
  }

  void recordContactRequest(submission).catch((error) => {
    logServerEvent("error", "contact.request-record.failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown-error",
    })
  })

  const outboxEntry = await createQueuedContactMessage(submission, {
    owner: `request:${requestId}`,
  })

  try {
    const result = await resendContactDelivery.deliver(submission)

    if (!result.ok) {
      await markContactMessageFailed(
        outboxEntry.id,
        result.failure ?? "upstream-delivery-rejected",
        undefined,
        outboxEntry.attempts,
        outboxEntry.leaseOwner,
      )

      logServerEvent("error", "contact.delivery.rejected", {
        requestId,
        clientIp,
        messageId: outboxEntry.id,
        reason: result.failure,
      })

      const queuedResponse = {
        ok: true,
        accepted: true,
        deliveryConfigured: isContactDeliveryConfigured(),
        duplicate: false,
        skippedDelivery: false,
        queued: true,
        deliveryPending: true,
        messageId: outboxEntry.id,
      }

      await storeIdempotencyReplay(request, submission, {
        status: 202,
        body: queuedResponse,
      })

      return jsonResponse(queuedResponse, {
        status: 202,
        requestId,
        headers: {
          "X-Contact-Message-Id": outboxEntry.id,
        },
      })
    }

    await markContactMessageDelivered(
      outboxEntry.id,
      result.skipped ? "skipped" : "delivered",
      outboxEntry.leaseOwner,
    )

    const successResponse = {
      ok: true,
      accepted: true,
      deliveryConfigured: isContactDeliveryConfigured(),
      duplicate: false,
      skippedDelivery: result.skipped,
      queued: true,
      messageId: outboxEntry.id,
    }

    await storeIdempotencyReplay(request, submission, {
      status: 200,
      body: successResponse,
    })

    return jsonResponse(successResponse, {
      requestId,
      headers: {
        "X-Contact-Message-Id": outboxEntry.id,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "unknown-error"
    await markContactMessageFailed(
      outboxEntry.id,
      errorMessage,
      undefined,
      outboxEntry.attempts,
      outboxEntry.leaseOwner,
    )

    logServerEvent("error", "contact.delivery.failed", {
      requestId,
      clientIp,
      messageId: outboxEntry.id,
      error: errorMessage,
    })

    const queuedResponse = {
      ok: true,
      accepted: true,
      deliveryConfigured: isContactDeliveryConfigured(),
      duplicate: false,
      skippedDelivery: false,
      queued: true,
      deliveryPending: true,
      messageId: outboxEntry.id,
    }

    await storeIdempotencyReplay(request, submission, {
      status: 202,
      body: queuedResponse,
    })

    return jsonResponse(queuedResponse, {
      status: 202,
      requestId,
      headers: {
        "X-Contact-Message-Id": outboxEntry.id,
      },
    })
  }
}
