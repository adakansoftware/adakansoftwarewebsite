import { isContactDeliveryConfigured } from "@/lib/server/contact-service"
import { createRequestId, jsonResponse } from "@/lib/server/http"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const requestId = createRequestId(request)

  return jsonResponse(
    {
      ok: true,
      service: "adakansoftware-website",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "development",
      checks: {
        contactDeliveryConfigured: isContactDeliveryConfigured(),
        requestId: true,
        originProtection: true,
        duplicateProtection: true,
      },
    },
    { requestId },
  )
}
