export type ApiResponseMeta = {
  durationMs: number;
  responseBytes: number;
  transferredBytes: number | null;
};

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
