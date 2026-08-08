import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import assert from "node:assert/strict"

const source = readFileSync(resolve("lib/site-data.ts"), "utf8")
const projectsSource = source.slice(source.indexOf("export const projectsByLocale"), source.indexOf("export const demoExamplesByLocale"))
const logoPath = "/projects/salihogullari-hafriyat-logo.png"

assert.ok(existsSync(resolve(`public${logoPath}`)), "The Salihoğulları project logo asset must exist")
assert.match(
  projectsSource,
  /title:\s*"Sallıhoğulları Hafriyat"[\s\S]*?logoImage:\s*"\/projects\/salihogullari-hafriyat-logo\.png"/,
  "The live Salihoğulları project must supply its logo to project cards",
)
