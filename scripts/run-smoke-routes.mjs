/* global URL, fetch, process, setTimeout */

import { spawn } from "node:child_process"
import { once } from "node:events"
import { fileURLToPath } from "node:url"

const port = process.env.SMOKE_PORT ?? "3101"
const baseUrl = process.env.SMOKE_BASE_URL ?? `http://127.0.0.1:${port}`
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url))

const server = spawn(process.execPath, [nextBin, "dev", "--hostname", "127.0.0.1", "--port", port], {
  env: {
    ...process.env,
    CONTACT_ADMIN_KEY: process.env.CONTACT_ADMIN_KEY ?? "test-admin-key",
    CONTACT_ADMIN_SIGNING_SECRET: process.env.CONTACT_ADMIN_SIGNING_SECRET ?? "test-admin-signing-secret",
    CONTACT_CRON_SECRET: process.env.CONTACT_CRON_SECRET ?? "test-cron-secret",
  },
  stdio: "inherit",
})

async function waitForServer() {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`)
      if (response.ok) return
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Smoke server did not become ready at ${baseUrl}`)
}

try {
  await waitForServer()
  const test = spawn(process.execPath, [fileURLToPath(new URL("./test-smoke-routes.mjs", import.meta.url))], {
    env: { ...process.env, SMOKE_BASE_URL: baseUrl },
    stdio: "inherit",
  })
  const [exitCode] = await once(test, "exit")
  process.exitCode = exitCode ?? 1
} finally {
  server.kill("SIGTERM")
}
