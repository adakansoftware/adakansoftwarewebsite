import { z } from "zod"

const contactRequestUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "in_progress", "completed"]),
  adminNote: z.string().trim().max(2_000),
})

export type ContactRequestStatus = z.infer<typeof contactRequestUpdateSchema>["status"]

export function parseContactRequestUpdate(payload: unknown) {
  const result = contactRequestUpdateSchema.safeParse(payload)
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, message: "Geçersiz iletişim talebi." }
}
