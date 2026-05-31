/**
 * Minimal structured logger. JSON output so it can be consumed by Vercel logs / Grafana / etc.
 * Not a generic abstraction — just enough for tool invocation traces.
 */
type LogLevel = "info" | "warn" | "error";

export function log(
  level: LogLevel,
  event: string,
  data?: Record<string, unknown>
) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
