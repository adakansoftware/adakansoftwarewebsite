/* global console, process */

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { extname } from "node:path"
import { pathToFileURL } from "node:url"

const binaryExtensions = new Set([".avif", ".gif", ".ico", ".jpeg", ".jpg", ".otf", ".png", ".webp"])

const secretPatterns = [
  { kind: "OpenAI API key", expression: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/ },
  { kind: "Resend API key", expression: /\bre_[A-Za-z0-9]{20,}\b/ },
  { kind: "GitHub token", expression: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/ },
  { kind: "AWS access key", expression: /\bAKIA[0-9A-Z]{16}\b/ },
  { kind: "Google API key", expression: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
  { kind: "private key", expression: /-----BEGIN (?:[A-Z0-9-]+ )?PRIVATE KEY(?: BLOCK)?-----/ },
]

const credentialNamePattern = "[A-Za-z][A-Za-z0-9_]*?(?:api[_-]?key|secret|token|password)[A-Za-z0-9_]*"
const quotedAssignmentPattern = new RegExp(`(?:^|[^A-Za-z0-9])${credentialNamePattern}\\s*[:=]\\s*["']([A-Za-z0-9_./+=-]{16,})["']`, "i")
const environmentAssignmentPattern = new RegExp(`^(?:export\\s+)?${credentialNamePattern}\\s*=\\s*([A-Za-z0-9_./+=-]{16,})\\s*$`, "i")
const placeholderPattern = /^(?:change-this|your-|re_your_|example|placeholder|test-|dummy|local-|worker-local-)/i

export function findSecretCandidates(content, file) {
  const candidates = []

  for (const [index, line] of content.split(/\r?\n/).entries()) {
    for (const { kind, expression } of secretPatterns) {
      if (expression.test(line)) candidates.push({ file, line: index + 1, kind })
    }

    const assignment = line.match(quotedAssignmentPattern) ?? line.match(environmentAssignmentPattern)
    if (assignment && !placeholderPattern.test(assignment[1])) {
      candidates.push({ file, line: index + 1, kind: "credential assignment" })
    }
  }

  return candidates
}

function trackedTextFiles() {
  return execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean)
    .filter((file) => !binaryExtensions.has(extname(file).toLowerCase()))
}

function scanRepository() {
  return trackedTextFiles().flatMap((file) => {
    try {
      return findSecretCandidates(readFileSync(file, "utf8"), file)
    } catch {
      return []
    }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidates = scanRepository()

  if (candidates.length === 0) {
    console.info("Secret scan passed.")
  } else {
    for (const candidate of candidates) {
      console.error(`Potential ${candidate.kind} detected in ${candidate.file}:${candidate.line}`)
    }
    process.exitCode = 1
  }
}
