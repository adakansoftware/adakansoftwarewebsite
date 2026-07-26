const PLACEHOLDER_VALUE_PATTERNS = [
  /change-this/i,
  /your[_-]/i,
  /example/i,
  /test-(admin|cron|signing)/i,
]

function isPlaceholderValue(value: string | undefined) {
  const normalized = value?.trim()
  return !normalized || PLACEHOLDER_VALUE_PATTERNS.some((pattern) => pattern.test(normalized))
}

export function getContactRuntimeConfigurationIssues(environment = process.env.NODE_ENV) {
  if (environment !== "production") {
    return []
  }

  const issues: string[] = []

  if (isPlaceholderValue(process.env.RESEND_API_KEY)) {
    issues.push("RESEND_API_KEY is required for production contact delivery")
  }

  if (isPlaceholderValue(process.env.RESEND_FROM_DOMAIN)) {
    issues.push("RESEND_FROM_DOMAIN is required for production contact delivery")
  }

  const adminKeyConfigured = !isPlaceholderValue(process.env.CONTACT_ADMIN_KEY)
  const signingSecretConfigured = !isPlaceholderValue(process.env.CONTACT_ADMIN_SIGNING_SECRET)
  if (!adminKeyConfigured && !signingSecretConfigured) {
    issues.push("A non-placeholder contact admin credential is required in production")
  }

  const cronSecret = process.env.CONTACT_CRON_SECRET?.trim()
  if (cronSecret && isPlaceholderValue(cronSecret)) {
    issues.push("CONTACT_CRON_SECRET cannot use a placeholder value in production")
  }

  if (process.env.CONTACT_STATE_BACKEND?.trim().toLowerCase() !== "redis") {
    issues.push("CONTACT_STATE_BACKEND=redis is required in production")
  }

  if (isPlaceholderValue(process.env.REDIS_URL)) {
    issues.push("REDIS_URL is required for the production contact state backend")
  }

  return issues
}

export function isContactRuntimeConfigurationValid(environment = process.env.NODE_ENV) {
  return getContactRuntimeConfigurationIssues(environment).length === 0
}
