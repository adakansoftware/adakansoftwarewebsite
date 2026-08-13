import type { ContactSubmission } from "@/lib/server/contact-service"
import { getNeonSql } from "@/lib/neon"

export async function recordContactRequest(submission: ContactSubmission) {
  await getNeonSql().query(
    "insert into contact_requests (name, email, phone, project, locale) values ($1, $2, $3, $4, $5)",
    [submission.name, submission.email, submission.phone ?? null, submission.project, submission.locale],
  )
}
