import { parseServerTiming, setApiResponseMeta } from "./api-response-meta";

export function measureResponseBody(responseText: string, headers: Headers) {
  const responseBytes = new TextEncoder().encode(responseText).byteLength;
  const contentLengthHeader = headers.get("content-length");
  const contentLength = contentLengthHeader === null ? Number.NaN : Number(contentLengthHeader);
  const transferredBytes = Number.isFinite(contentLength) && contentLength >= 0 ? contentLength : null;
  return { responseBytes, transferredBytes };
}

export function recordApiResponseDiagnostics(
  data: unknown,
  requestStartedAt: number,
  headers: Headers,
  bodyMeasurement: ReturnType<typeof measureResponseBody>,
) {
  setApiResponseMeta(data, {
    durationMs: performance.now() - requestStartedAt,
    ...bodyMeasurement,
    serverTimings: parseServerTiming(headers.get("server-timing")),
  });
}
