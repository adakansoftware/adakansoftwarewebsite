import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

assert.ok(existsSync("components/pricing-section.tsx"), "Missing pricing section")
const source = readFileSync("components/pricing-section.tsx", "utf8")
assert.match(source, /esnek fiyatlandırma/)
assert.match(source, /useInView/)
assert.match(readFileSync("app/page.tsx", "utf8"), /PricingSection/)
assert.match(readFileSync("lib/shell-content.ts", "utf8"), /Fiyatlar/)
assert.ok(existsSync("app/pricing/page.tsx"), "Missing standalone pricing page")
assert.ok(existsSync("app/[locale]/pricing/page.tsx"), "Missing localized pricing page")
