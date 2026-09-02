import assert from "node:assert/strict"
import test from "node:test"

import { findSecretCandidates } from "./check-secrets.mjs"

test("finds recognisable credential formats without returning their values", () => {
  const candidates = findSecretCandidates(
    [
      `const key = "${["sk-proj-", "abcdefghijklmnopqrstuvwxyz123456"].join("")}"`,
      `const privateKey = "${["-----BEGIN ", "PRIVATE KEY-----"].join("")}"`,
    ].join("\n"),
    "lib/example.ts",
  )

  assert.deepEqual(candidates, [
    { file: "lib/example.ts", line: 1, kind: "OpenAI API key" },
    { file: "lib/example.ts", line: 2, kind: "private key" },
  ])
})

test("does not flag placeholders or environment-variable references", () => {
  const candidates = findSecretCandidates(
    [
      "RESEND_API_KEY=re_your_production_key_here",
      "const apiKey = process.env.OPENAI_API_KEY",
    ].join("\n"),
    ".env.example",
  )

  assert.deepEqual(candidates, [])
})
