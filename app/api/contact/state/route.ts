import { getContactStateStore, getContactStateStoreStatus } from "@/lib/server/contact-state-store"
import { getSafeContactStateError } from "@/lib/server/contact-state-status"
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

  if (!(await isAuthorizedAdminRequest(request))) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401, requestId })
  }

  const stateStatus = await getContactStateStoreStatus()
  if (!stateStatus.available) {
    return jsonResponse(
      { ok: false, error: getSafeContactStateError(stateStatus) },
      { status: 503, requestId },
    )
  }

  const stateStore = getContactStateStore()
  const worker = await stateStore.readWorkerRuntimeState()

  return jsonResponse(
    {
      ok: true,
      backend: stateStore.backend,
      capabilities: stateStatus.capabilities,
      available: true,
      error: null,
      worker,
    },
    { requestId },
  )
}
