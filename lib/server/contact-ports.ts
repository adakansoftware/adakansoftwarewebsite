import type { ContactSubmission } from "@/lib/server/contact-service"

export type ContactDeliveryResult =
  | { ok: true; skipped: boolean; failure: null }
  | { ok: false; skipped: false; failure: string }

export type ContactDeliveryPort = {
  deliver(submission: ContactSubmission): Promise<ContactDeliveryResult>
}

export type ClockPort = {
  now(): number
}

export const systemClock: ClockPort = {
  now: () => Date.now(),
}
