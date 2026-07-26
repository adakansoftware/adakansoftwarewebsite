import { getContactPipelineDiagnostics } from "@/lib/server/contact-pipeline"
import { getContactServiceDiagnostics, isContactDeliveryConfigured } from "@/lib/server/contact-service"
import { contactPolicy } from "@/lib/server/contact-policy"
import { getProxyRateLimitDiagnostics } from "@/lib/server/proxy-rate-limit"
import { getContactStateStore, getContactStateStoreStatus } from "@/lib/server/contact-state-store"
import {
  createRequestId,
  emptyResponse,
  hasSignedAdminNonceProtection,
  hasSignedAdminProtection,
  isAuthorizedAdminRequest,
  jsonResponse,
} from "@/lib/server/http"

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
  const includeDiagnostics = isAuthorizedAdminRequest(request)
  const diagnostics = getContactServiceDiagnostics()
  const proxyRateLimit = getProxyRateLimitDiagnostics()
  const pipeline = await getContactPipelineDiagnostics()
  const stateStatus = await getContactStateStoreStatus()
  const workerRuntime = stateStatus.available
    ? await getContactStateStore().readWorkerRuntimeState()
    : {
      workerId: null,
      lastHeartbeatAt: null,
      lastReplayAt: null,
      lastBatchSize: null,
      lastOutcome: null,
      lastError: stateStatus.error,
    }
  const stateCapabilities = stateStatus.capabilities
  const hasQueueAlerts = pipeline.alerts.length > 0
  const workerHeartbeatAgeMs =
    workerRuntime.lastHeartbeatAt === null ? null : Date.now() - workerRuntime.lastHeartbeatAt
  const automaticReplayConfigured = Boolean(process.env.CONTACT_CRON_SECRET?.trim())
  const workerHealthy = !automaticReplayConfigured
    || (workerHeartbeatAgeMs !== null && workerHeartbeatAgeMs <= contactPolicy.queueAlertAgeMs)
  const status =
    process.env.NODE_ENV === "production"
      && (!isContactDeliveryConfigured() || hasQueueAlerts || !workerHealthy || !stateStatus.available)
      ? "degraded"
      : "ok"

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
        automaticReplayAvailable: automaticReplayConfigured,
        automaticReplayHealthy: workerHealthy,
        requestedStateBackendImplemented: stateCapabilities.requestedBackendImplemented,
        requestedStateBackendReady: stateCapabilities.requestedBackendReady,
        stateBackendAvailable: stateStatus.available,
        queueHealthy: !hasQueueAlerts,
      },
      ...(includeDiagnostics
        ? {
            diagnostics,
            pipeline,
            state: {
              ...stateCapabilities,
              available: stateStatus.available,
              error: stateStatus.error,
            },
            worker: {
              ...workerRuntime,
              heartbeatAgeMs: workerHeartbeatAgeMs,
            },
            proxy: proxyRateLimit,
          }
        : {}),
    },
    {
      requestId,
      headers: {
        Allow: ALLOW_HEADER_VALUE,
      },
    },
  )
}
