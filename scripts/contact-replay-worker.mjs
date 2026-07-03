/* global console, fetch, process */

import { randomUUID } from "node:crypto"

const baseUrl = process.env.CONTACT_WORKER_BASE_URL ?? "http://127.0.0.1:3000"
const cronSecret = process.env.CONTACT_CRON_SECRET

if (!cronSecret) {
  throw new Error("CONTACT_CRON_SECRET is required")
}

const batchSize = process.env.CONTACT_WORKER_BATCH_SIZE?.trim()
const workerId = process.env.CONTACT_WORKER_ID?.trim() || `worker-${randomUUID()}`

const response = await fetch(`${baseUrl}/api/contact/replay/cron`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${cronSecret}`,
    "X-Worker-Id": workerId,
    ...(batchSize ? { "X-Outbox-Batch-Size": batchSize } : {}),
  },
})

const body = await response.text()

if (!response.ok) {
  throw new Error(`Contact replay worker failed with ${response.status}: ${body}`)
}

console.log(body)
