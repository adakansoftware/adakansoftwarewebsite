import { getContactPipelineDiagnostics } from "@/lib/server/contact-pipeline"
import { getContactServiceDiagnostics, isContactDeliveryConfigured } from "@/lib/server/contact-service"
import { getProxyRateLimitDiagnostics } from "@/lib/server/proxy-rate-limit"
import { createRequestId, emptyResponse, hasSignedAdminNonceProtection, hasSignedAdminProtection, jsonResponse } from "@/lib/server/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOW_HEADER_VALUE = "GET, HEAD, OPTIONS"

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

export async function HEAD(request: Request) {
  const requestId = createRequestId(request)

  return emptyResponse({
    status: 200,
    requestId,
    headers: {
      Allow: ALLOW_HEADER_VALUE,
    },
  })
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)
  const diagnostics = getContactServiceDiagnostics()
  const proxyRateLimit = getProxyRateLimitDiagnostics()
  const pipeline = await getContactPipelineDiagnostics()
  const hasQueueAlerts = pipeline.alerts.length > 0
  const status =
    process.env.NODE_ENV === "production" && (!isContactDeliveryConfigured() || hasQueueAlerts) ? "degraded" : "ok"

  return jsonResponse(
    {
      ok: true,
      status,
      service: "adakansoftware-website",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "development",
      checks: {
        contactDeliveryConfigured: diagnostics.deliveryConfigured,
        requestId: true,
        originProtection: true,
        duplicateProtection: true,
        idempotencyProtection: true,
        outboxTracking: true,
        replayEndpointProtected: true,
        signedAdminProtection: hasSignedAdminProtection(),
        signedAdminNonceProtection: hasSignedAdminNonceProtection(),
        automaticReplayAvailable: Boolean(process.env.CONTACT_CRON_SECRET?.trim()),
        queueHealthy: !hasQueueAlerts,
      },
      diagnostics,
      pipeline,
      proxy: proxyRateLimit,
    },
    {
      requestId,
      headers: {
        Allow: ALLOW_HEADER_VALUE,
      },
    },
  )
}
