export type ApiErrorCode =
  "aborted" | "http" | "network" | "timeout" | "validation";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;
  readonly details: unknown;
  readonly retryAfterMs: number | null;

  constructor(
    message: string,
    options: {
      code: ApiErrorCode;
      status?: number | null;
      details?: unknown;
      retryAfter?: string | null;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status ?? null;
    this.details = options.details;
    const header = options.retryAfter?.trim();
    const seconds = header ? Number(header) : Number.NaN;
    const date = header ? Date.parse(header) : Number.NaN;
    const delay =
      Number.isFinite(seconds) && seconds >= 0
        ? seconds * 1000
        : Number.isNaN(seconds) && Number.isFinite(date)
          ? Math.max(0, date - Date.now())
          : null;
    this.retryAfterMs =
      delay !== null && Number.isFinite(delay)
        ? Math.min(delay, 2_147_483_647)
        : null;
  }
}

export type PaginationMetadata = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMetadata;
};
