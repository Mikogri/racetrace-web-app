import { describe, expect, it } from 'vitest'
import { ApiError } from '../types/api'
import { queryClient, shouldRetryQuery } from './react-query'

describe('query retries', () => {
  it('refreshes stale data on focus without polling or removing previous data', () => {
    const options = queryClient.getDefaultOptions().queries!
    expect(options.refetchOnWindowFocus).toBe(true)
    expect(options.staleTime).toBe(30_000)
    expect(options.refetchInterval).toBeUndefined()
    expect(options.placeholderData).toBeTypeOf('function')
  })
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
  it('waits for Retry-After instead of immediately retrying a rate-limited request', () => {
    const delay = queryClient.getDefaultOptions().queries!.retryDelay
    expect(delay).toBeTypeOf('function')
    if (typeof delay !== 'function') throw new Error('Missing retry delay policy')
    expect(delay(0, new ApiError('Limited', { code: 'http', status: 429, retryAfter: '60' }))).toBe(60_000)
    expect(delay(1, new ApiError('Failed', { code: 'network' }))).toBe(2_000)
    expect(delay(0, new ApiError('Limited', { code: 'http', status: 429, retryAfter: 'invalid' }))).toBe(1_000)
  })
})
