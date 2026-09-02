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
      "VENDOR_API_KEY=change-this-example-key",
      "const clientSecret = process.env.VENDOR_CLIENT_SECRET",
    ].join("\n"),
    ".env.example",
  )

  assert.deepEqual(candidates, [])
})

test("finds generic credential assignments with underscore and camelCase names", () => {
  const value = ["qwertyuiop", "asdfghjklzxcvbnm"].join("")
  const candidates = findSecretCandidates(
    [
      `VENDOR_API_KEY=${value}`,
      `const clientSecret = \"${value}\"`,
    ].join("\n"),
    "docs/plan.md",
  )

  assert.deepEqual(candidates, [
    { file: "docs/plan.md", line: 1, kind: "credential assignment" },
    { file: "docs/plan.md", line: 2, kind: "credential assignment" },
  ])
})

test("finds DSA and PGP private-key headers", () => {
  const candidates = findSecretCandidates(
    [
      ["-----BEGIN ", "DSA PRIVATE KEY-----"].join(""),
      ["-----BEGIN ", "PGP PRIVATE KEY BLOCK-----"].join(""),
    ].join("\n"),
    "docs/plan.md",
  )

  assert.deepEqual(candidates, [
    { file: "docs/plan.md", line: 1, kind: "private key" },
    { file: "docs/plan.md", line: 2, kind: "private key" },
  ])
})

test("does not flag runtime values assigned to credential-named variables", () => {
  const candidates = findSecretCandidates(
    "const bearerToken = request.headers.get(\"authorization\")",
    "lib/request.ts",
  )

  assert.deepEqual(candidates, [])
})
