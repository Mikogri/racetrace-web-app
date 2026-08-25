import { describe, expect, it } from 'vitest'
import { getRatingTone } from './rating'

describe('getRatingTone', () => {
  it.each([
    [0, 'low'],
    [49.99, 'low'],
    [50, 'medium'],
    [69.99, 'medium'],
    [70, 'high'],
    [79.99, 'high'],
    [80, 'veryHigh'],
    [89.99, 'veryHigh'],
    [90, 'top'],
  ] as const)('maps %s to %s', (value, expected) => {
    expect(getRatingTone(value)).toBe(expected)
  })
})
