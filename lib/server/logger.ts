type LogLevel = "info" | "warn" | "error"

type LogContext = Record<string, unknown>

export function logServerEvent(level: LogLevel, event: string, context: LogContext = {}) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...context,
  }

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
