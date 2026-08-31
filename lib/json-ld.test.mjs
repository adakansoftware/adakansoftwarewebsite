import assert from "node:assert/strict"
import test from "node:test"

import { serializeJsonLd } from "./json-ld.ts"

test("escapes script-breaking characters in structured data", () => {
  const serialized = serializeJsonLd({ value: "</script><script>alert(1)</script>" })
  assert.doesNotMatch(serialized, /<\/script>/i)
  assert.match(serialized, /\\u003c\/script\\u003e/)
})
