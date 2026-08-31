type LogLevel = "info" | "warn" | "error"

type LogContext = Record<string, unknown>
type LogPayload = LogContext & {
  schemaVersion: 1
  level: LogLevel
  event: string
  timestamp: string
}

const SENSITIVE_KEY = /(authorization|cookie|email|password|secret|token|api[_-]?key|phone)/i

function sanitizeLogValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeLogValue)
  if (!value || typeof value !== "object") return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
      key,
      SENSITIVE_KEY.test(key) ? "[REDACTED]" : sanitizeLogValue(nestedValue),
    ]),
  )
}

export function createLogPayload(level: LogLevel, event: string, context: LogContext = {}): LogPayload {
  return {
    schemaVersion: 1,
    level,
    event,
    timestamp: new Date().toISOString(),
    ...(sanitizeLogValue(context) as LogContext),
  }
}

export function logServerEvent(level: LogLevel, event: string, context: LogContext = {}) {
  const payload = createLogPayload(level, event, context)

  const line = JSON.stringify(payload)

  if (level === "error") {
    console.error(line)
    return
  }

  if (level === "warn") {
    console.warn(line)
    return
  }

  console.info(line)
}
