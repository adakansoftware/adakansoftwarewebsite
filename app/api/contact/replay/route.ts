import { contactPolicy } from "@/lib/server/contact-policy"
import { getContactPipelineDiagnostics, processContactOutboxEntries } from "@/lib/server/contact-pipeline"
import { createRequestId, emptyResponse, isAuthorizedAdminRequest, jsonResponse } from "@/lib/server/http"

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

export async function POST(request: Request) {
  const requestId = createRequestId(request)

  if (!isAuthorizedAdminRequest(request)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401, requestId })
  }

  const batchSizeHeader = request.headers.get("x-outbox-batch-size")
  const requestedBatchSize = batchSizeHeader ? Number.parseInt(batchSizeHeader, 10) : Number.NaN
  const batchSize =
    Number.isFinite(requestedBatchSize) && requestedBatchSize > 0
      ? Math.min(requestedBatchSize, contactPolicy.outboxReplayBatchSize)
      : contactPolicy.outboxReplayBatchSize

  const replay = await processContactOutboxEntries(batchSize)
  const pipeline = await getContactPipelineDiagnostics()

  return jsonResponse(
    {
      ok: true,
      replay,
      pipeline,
    },
    { requestId },
  )
}
