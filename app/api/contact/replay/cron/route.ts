import { contactPolicy } from "@/lib/server/contact-policy"
import { getContactPipelineDiagnostics, runContactOutboxReplay } from "@/lib/server/contact-pipeline"
import { getContactStateStore } from "@/lib/server/contact-state-store"
import { createRequestId, emptyResponse, getClientIp, isAuthorizedCronRequest, jsonResponse } from "@/lib/server/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOW_HEADER_VALUE = "GET, POST, OPTIONS"

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

export async function POST(request: Request) {
  const requestId = createRequestId(request)
  const clientIp = getClientIp(request)
  const workerId = request.headers.get("x-worker-id")?.trim() || "unknown-worker"

  if (!isAuthorizedCronRequest(request)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401, requestId })
  }

  const batchSizeHeader = request.headers.get("x-outbox-batch-size")
  const requestedBatchSize = batchSizeHeader ? Number.parseInt(batchSizeHeader, 10) : Number.NaN
  const batchSize =
    Number.isFinite(requestedBatchSize) && requestedBatchSize > 0
      ? Math.min(requestedBatchSize, contactPolicy.outboxReplayBatchSize)
      : contactPolicy.outboxReplayBatchSize
  const stateStore = getContactStateStore()

  await stateStore.writeWorkerRuntimeState({
    workerId,
    lastHeartbeatAt: Date.now(),
    lastReplayAt: null,
    lastBatchSize: batchSize,
    lastOutcome: "idle",
    lastError: null,
  })

  const replayResult = await runContactOutboxReplay({
    limit: batchSize,
    requestId,
    actor: "system-cron",
    reason: "scheduled replay",
    clientIp,
  })

  if (!replayResult.ok) {
    await stateStore.writeWorkerRuntimeState({
      workerId,
      lastHeartbeatAt: Date.now(),
      lastReplayAt: Date.now(),
      lastBatchSize: batchSize,
      lastOutcome: "failed",
      lastError: "replay-already-in-progress",
    })

    return jsonResponse(
      {
        ok: false,
        error: "Replay already in progress",
        lock: replayResult.lock,
      },
      { status: 409, requestId },
    )
  }

  const pipeline = await getContactPipelineDiagnostics()
  await stateStore.writeWorkerRuntimeState({
    workerId,
    lastHeartbeatAt: Date.now(),
    lastReplayAt: Date.now(),
    lastBatchSize: batchSize,
    lastOutcome: "completed",
    lastError: null,
  })

  return jsonResponse(
    {
      ok: true,
      replay: replayResult.replay,
      pipeline,
    },
    { requestId },
  )
}

// Vercel Cron invokes configured paths with GET and an Authorization bearer token.
export async function GET(request: Request) {
  return POST(request)
}
