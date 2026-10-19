import { afterEach, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { apiClient } from './api-client'

afterEach(() => vi.unstubAllGlobals())

it('preserves Retry-After from the real HTTP error response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
    JSON.stringify({ error: { code: 'RATE_LIMITED', message: 'Too many requests.' } }),
    { status: 429, headers: { 'Retry-After': '60', 'Content-Type': 'application/json' } },
  )))
  await expect(apiClient.get('/api/v1/ranking', z.unknown())).rejects.toMatchObject({
    code: 'http', status: 429, retryAfterMs: 60_000,
  })
})
