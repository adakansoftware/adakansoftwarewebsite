import { contactPolicy } from "@/lib/server/contact-policy"
import { getContactPipelineDiagnostics, runContactOutboxReplay } from "@/lib/server/contact-pipeline"
import { createRequestId, emptyResponse, getClientIp, isAuthorizedAdminRequest, jsonResponse } from "@/lib/server/http"

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

  if (!(await isAuthorizedAdminRequest(request))) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401, requestId })
  }

  const batchSizeHeader = request.headers.get("x-outbox-batch-size")
  const requestedBatchSize = batchSizeHeader ? Number.parseInt(batchSizeHeader, 10) : Number.NaN
  const batchSize =
    Number.isFinite(requestedBatchSize) && requestedBatchSize > 0
      ? Math.min(requestedBatchSize, contactPolicy.outboxReplayBatchSize)
      : contactPolicy.outboxReplayBatchSize
  const reason = request.headers.get("x-replay-reason")?.trim()

  if (!reason || reason.length < 8 || reason.length > 200) {
    return jsonResponse(
      { ok: false, error: "Replay reason required" },
      { status: 400, requestId },
    )
  }

  const replayResult = await runContactOutboxReplay({
    limit: batchSize,
    requestId,
    actor: request.headers.get("x-admin-actor")?.trim() || "unknown-admin",
    reason,
    clientIp,
  })

  if (!replayResult.ok) {
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

  return jsonResponse(
    {
      ok: true,
      replay: replayResult.replay,
      pipeline,
    },
    { requestId },
  )
}

export async function GET(request: Request) {
  const requestId = createRequestId(request)

  if (!(await isAuthorizedAdminRequest(request))) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401, requestId })
  }

  const pipeline = await getContactPipelineDiagnostics()

  return jsonResponse(
    {
      ok: true,
      pipeline,
    },
    { requestId },
  )
}
