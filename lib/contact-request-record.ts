export type ContactRequestWriteInput = {
  name: string
  email: string
  phone?: string
  project: string
  locale: "tr" | "en"
}

type SqlClient = {
  query(statement: string, values: (string | null)[]): Promise<unknown>
}

export function createContactRequestRecorder(sql: SqlClient) {
  return async function recordContactRequest(submission: ContactRequestWriteInput) {
    await sql.query(
      "insert into contact_requests (name, email, phone, project, locale) values ($1, $2, $3, $4, $5)",
      [submission.name, submission.email, submission.phone ?? null, submission.project, submission.locale],
    )
  }
}
