import { describe, expect, it } from 'vitest'
import { ApiError } from '../types/api'
import { shouldRetryQuery } from './react-query'

describe('query retries', () => {
  it.each([408, 429, 500, 502, 503, 504])('retries transient HTTP %i at most twice', (status) => {
    const error = new ApiError('Failed', { code: 'http', status })
    expect(shouldRetryQuery(0, error)).toBe(true)
    expect(shouldRetryQuery(1, error)).toBe(true)
    expect(shouldRetryQuery(2, error)).toBe(false)
  })
  it.each([400, 401, 403, 404, 409, 422, 501, 505])('does not retry HTTP %i', (status) => {
    expect(shouldRetryQuery(0, new ApiError('Failed', { code: 'http', status }))).toBe(false)
  })
  it.each(['network', 'timeout'] as const)('retries %s', (code) => {
    expect(shouldRetryQuery(0, new ApiError('Failed', { code }))).toBe(true)
  })
  it.each(['aborted', 'validation'] as const)('does not retry %s', (code) => {
    expect(shouldRetryQuery(0, new ApiError('Failed', { code }))).toBe(false)
  })
  it('does not retry unknown/programming errors', () => {
    expect(shouldRetryQuery(0, new Error('Unexpected'))).toBe(false)
  })
})
