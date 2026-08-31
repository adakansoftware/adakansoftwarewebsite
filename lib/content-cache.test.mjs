import assert from "node:assert/strict"
import test from "node:test"

import { getManagedContentCacheTag } from "./content-cache.ts"

test("returns stable, distinct cache tags for each managed content kind", () => {
  assert.equal(getManagedContentCacheTag("projects"), "managed-content:projects")
  assert.equal(getManagedContentCacheTag("logo_works"), "managed-content:logo_works")
})
