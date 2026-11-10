export type ApiResponseMeta = {
  durationMs: number;
  responseBytes: number;
  transferredBytes: number | null;
  serverTimings?: Record<string, number>;
};

const rankingPhases = new Set([
  "filters",
  "sessions",
  "packages",
  "metrics",
  "rows",
  "comparison",
  "supabase_headers",
  "supabase_io",
  "cache",
  "snapshot_cache",
  "api",
]);

export function parseServerTiming(
  header: string | null,
): Record<string, number> {
  const phases: Record<string, number> = {};
  for (const entry of header?.split(",") ?? []) {
    const [name, ...parameters] = entry.trim().split(";");
    if (!rankingPhases.has(name)) continue;
    if (name === "cache" || name === "snapshot_cache") {
      phases[name] = 0;
      continue;
    }
    const duration = parameters
      .find((parameter) => parameter.trim().startsWith("dur="))
      ?.trim()
      .slice(4);
    if (duration === undefined) continue;
    const value = Number(duration);
    if (Number.isFinite(value) && value >= 0) phases[name] = value;
  }
  return phases;
}

const responseMetadata = new WeakMap<object, ApiResponseMeta>();

export function setApiResponseMeta(value: unknown, metadata: ApiResponseMeta) {
  if (typeof value === "object" && value !== null)
    responseMetadata.set(value, metadata);
}

export function getApiResponseMeta(value: unknown) {
  return typeof value === "object" && value !== null
    ? responseMetadata.get(value)
    : undefined;
}
