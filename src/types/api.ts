export type ApiErrorCode = 'aborted' | 'http' | 'network' | 'timeout' | 'validation'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number | null
  readonly details: unknown

  constructor(
    message: string,
    options: { code: ApiErrorCode; status?: number | null; details?: unknown },
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status ?? null
    this.details = options.details
  }
}

export type PaginationMetadata = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type PaginatedResult<T> = {
  items: T[]
  pagination: PaginationMetadata
}
