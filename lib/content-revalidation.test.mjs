import assert from "node:assert/strict"
import test from "node:test"

import { getContentRevalidationPaths } from "./content-revalidation.ts"

test("returns every localized public route affected by portfolio content", () => {
  assert.deepEqual(getContentRevalidationPaths("projects"), ["/", "/en", "/projects", "/en/projects"])
  assert.deepEqual(getContentRevalidationPaths("logo_works"), ["/", "/en", "/logo", "/en/logo"])
})
