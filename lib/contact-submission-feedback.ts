export type ContactDeliveryState = "accepted" | "pending"

export function getContactDeliveryState(payload: unknown): ContactDeliveryState | null {
  if (!payload || typeof payload !== "object") return null

  const result = payload as { ok?: unknown; deliveryPending?: unknown }
  if (result.ok !== true) return null
  return result.deliveryPending === true ? "pending" : "accepted"
}
