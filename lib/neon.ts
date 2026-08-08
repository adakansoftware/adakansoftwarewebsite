import { neon } from "@neondatabase/serverless"

export function getNeonSql() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL tanımlı değil.")
  return neon(databaseUrl)
}
