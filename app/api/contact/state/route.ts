import { getContactStateStore, getContactStateStoreStatus } from "@/lib/server/contact-state-store"
import { createRequestId, emptyResponse, isAuthorizedAdminRequest, jsonResponse } from "@/lib/server/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOW_HEADER_VALUE = "GET, OPTIONS"

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

  if (!isAuthorizedAdminRequest(request)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401, requestId })
  }

  const stateStore = getContactStateStore()
  const stateStatus = await getContactStateStoreStatus()
  const worker = stateStatus.available ? await stateStore.readWorkerRuntimeState() : null

  return jsonResponse(
    {
      ok: true,
      backend: stateStore.backend,
      capabilities: stateStatus.capabilities,
      available: stateStatus.available,
      error: stateStatus.error,
      worker,
    },
    { status: stateStatus.available ? 200 : 503, requestId },
  )
}
