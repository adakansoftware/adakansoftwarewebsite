import type { ContactSubmission } from "@/lib/server/contact-service"
import { getNeonSql } from "@/lib/neon"
import { createContactRequestRecorder } from "@/lib/contact-request-record"

export async function recordContactRequest(submission: ContactSubmission) {
  await createContactRequestRecorder(getNeonSql())(submission)
}
