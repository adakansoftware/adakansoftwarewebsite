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
