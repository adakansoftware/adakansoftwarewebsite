import { createHash } from "node:crypto"

import { z } from "zod"

import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"
import { contactPolicy, getContactPolicySnapshot } from "@/lib/server/contact-policy"
import { pruneExpiredBuckets, pruneExpiredEntries } from "@/lib/server/memory-store"

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined
  }

  const normalized = normalizeWhitespace(value)
  return normalized || undefined
}

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80).transform(normalizeWhitespace),
  email: z.string().trim().email().max(120).transform((value) => value.toLowerCase()),
  phone: z.preprocess(normalizeOptionalString, z.string().max(40).optional()),
  project: z.string().trim().min(10).max(4000).transform(normalizeWhitespace),
  locale: z.enum(["tr", "en"]).optional(),
  website: z.preprocess(normalizeOptionalString, z.string().max(200).optional()),
})

const requestTimestampsByIp = new Map<string, number[]>()
const recentSubmissionFingerprints = new Map<string, number>()

export type ContactSubmission = z.infer<typeof contactSchema> & { locale: Locale }

export function getContactContentLengthLimit() {
  return contactPolicy.maxContentLength
}

export function hasSpamTrapValue(payload: unknown) {
  if (typeof payload !== "object" || payload === null || !("website" in payload)) {
    return false
  }

  return typeof payload.website === "string" && payload.website.trim().length > 0
}

export function parseContactPayload(payload: unknown) {
  const result = contactSchema.safeParse(payload)

  if (!result.success) {
    return null
  }

  return {
    ...result.data,
    locale: result.data.locale ?? "tr",
  } satisfies ContactSubmission
}

export function isRateLimited(ip: string, now: number) {
  if (requestTimestampsByIp.size > 200) {
    pruneExpiredBuckets(requestTimestampsByIp, now, contactPolicy.rateLimitWindowMs)
  }

  const recentTimestamps = (requestTimestampsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < contactPolicy.rateLimitWindowMs,
  )

  recentTimestamps.push(now)
  requestTimestampsByIp.set(ip, recentTimestamps)

  return recentTimestamps.length > contactPolicy.rateLimitMaxRequests
}

function getSubmissionFingerprint(input: { email: string; project: string; locale: Locale; ip: string }) {
  return createHash("sha256")
    .update(`${input.email}\n${input.project}\n${input.locale}\n${input.ip}`)
    .digest("hex")
}

export function isDuplicateSubmission(submission: ContactSubmission, ip: string, now: number) {
  if (recentSubmissionFingerprints.size > 500) {
    pruneExpiredEntries(recentSubmissionFingerprints, now, contactPolicy.duplicateWindowMs)
  }

  const fingerprint = getSubmissionFingerprint({
    email: submission.email,
    project: submission.project,
    locale: submission.locale,
    ip,
  })

  const previousTimestamp = recentSubmissionFingerprints.get(fingerprint)
  if (previousTimestamp && now - previousTimestamp < contactPolicy.duplicateWindowMs) {
    recentSubmissionFingerprints.set(fingerprint, now)
    return true
  }

  recentSubmissionFingerprints.set(fingerprint, now)
  return false
}

function getFromAddress() {
  const fromDomain = process.env.RESEND_FROM_DOMAIN ?? "resend.dev"
  return fromDomain === "resend.dev"
    ? "Adakan Software <onboarding@resend.dev>"
    : `Adakan Software Website <noreply@${fromDomain}>`
}

function getSubject(locale: Locale) {
  return locale === "tr" ? "Yeni proje görüşmesi" : "New project inquiry"
}

function getText(submission: ContactSubmission) {
  return [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone ?? "-"}`,
    `Locale: ${submission.locale}`,
    "",
    "Project:",
    submission.project,
  ].join("\n")
}

export function isContactDeliveryConfigured() {
  const resendApiKey = process.env.RESEND_API_KEY
  return Boolean(resendApiKey && resendApiKey !== "re_your_key_here")
}

export function getContactServiceDiagnostics() {
  return {
    deliveryConfigured: isContactDeliveryConfigured(),
    inMemoryRateLimitBuckets: requestTimestampsByIp.size,
    inMemoryDuplicateFingerprints: recentSubmissionFingerprints.size,
    policy: getContactPolicySnapshot(),
  }
}

export async function deliverContactMessage(submission: ContactSubmission) {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey || resendApiKey === "re_your_key_here") {
    return { ok: true, skipped: true, failure: null } as const
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: [siteConfig.email],
      reply_to: submission.email,
      subject: getSubject(submission.locale),
      text: getText(submission),
    }),
    signal: AbortSignal.timeout(contactPolicy.deliveryTimeoutMs),
  })

  return {
    ok: response.ok,
    skipped: false,
    failure: response.ok
      ? null
      : response.status === 429 || response.status >= 500
        ? `resend-retryable-${response.status}`
        : `resend-rejected-${response.status}`,
  } as const
}
