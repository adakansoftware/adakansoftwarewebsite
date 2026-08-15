import { z } from "zod"

const contactRequestUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "in_progress", "completed"]),
  adminNote: z.string().trim().max(2_000),
})

export type ContactRequestStatus = z.infer<typeof contactRequestUpdateSchema>["status"]

export type AdminContactRequest = {
  id: string
  name: string
  email: string
  phone: string | null
  project: string
  locale: "tr" | "en"
  status: ContactRequestStatus
  adminNote: string
  createdAt: string | null
}

const contactStatuses = new Set<ContactRequestStatus>(["new", "in_progress", "completed"])

const contactStatusLabels: Record<ContactRequestStatus, string> = {
  new: "Yeni",
  in_progress: "İnceleniyor",
  completed: "Tamamlandı",
}

export function contactRequestStatusLabel(status: ContactRequestStatus) {
  return contactStatusLabels[status]
}

function getStringValue(row: Record<string, unknown>, key: string) {
  const value = row[key]
  return typeof value === "string" ? value : null
}

function getTimestampValue(value: unknown) {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "string") {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
  }
  return null
}

export function toContactRequest(row: unknown): AdminContactRequest | null {
  if (!row || typeof row !== "object") return null

  const values = row as Record<string, unknown>
  const id = getStringValue(values, "id")
  const name = getStringValue(values, "name")
  const email = getStringValue(values, "email")
  const project = getStringValue(values, "project")
  const locale = getStringValue(values, "locale")
  const status = getStringValue(values, "status")

  if (!id || !name || !email || project === null || (locale !== "tr" && locale !== "en") || !status || !contactStatuses.has(status as ContactRequestStatus)) return null

  const phone = getStringValue(values, "phone")
  const adminNote = getStringValue(values, "admin_note")

  return {
    id,
    name,
    email,
    phone,
    project,
    locale,
    status: status as ContactRequestStatus,
    adminNote: adminNote ?? "",
    createdAt: getTimestampValue(values.created_at),
  }
}

export function filterContactRequests(requests: AdminContactRequest[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return requests

  return requests.filter((request) =>
    `${request.name} ${request.email} ${request.project}`.toLocaleLowerCase().includes(normalizedQuery),
  )
}

export function parseContactRequestUpdate(payload: unknown) {
  const result = contactRequestUpdateSchema.safeParse(payload)
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, message: "Geçersiz iletişim talebi." }
}
