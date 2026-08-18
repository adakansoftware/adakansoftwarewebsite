import assert from "node:assert/strict"
import test from "node:test"

import {
  getManagedContentSourceStatus,
  recordManagedContentSource,
} from "./content-source-status.ts"

test("reports the latest non-sensitive content source states", () => {
  recordManagedContentSource("projects", "managed")
  recordManagedContentSource("logo_works", "fallback-error")

  assert.deepEqual(getManagedContentSourceStatus(), {
    projects: "managed",
    logoWorks: "fallback-error",
  })
})

test("returns a content source status snapshot that cannot mutate stored state", () => {
  recordManagedContentSource("projects", "managed")
  const snapshot = getManagedContentSourceStatus()
  snapshot.projects = "fallback-error"

  assert.equal(getManagedContentSourceStatus().projects, "managed")
})
