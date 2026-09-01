import { describe, expect, it } from 'vitest'
import { getRatingTone } from './rating'

describe('getRatingTone', () => {
  it.each([
    [0, 'low'],
    [49.94, 'low'],
    [49.95, 'medium'],
    [50, 'medium'],
    [69.94, 'medium'],
    [69.95, 'high'],
    [70, 'high'],
    [79.94, 'high'],
    [79.95, 'veryHigh'],
    [80, 'veryHigh'],
    [89.94, 'veryHigh'],
    [89.95, 'top'],
    [90, 'top'],
  ] as const)('maps %s to %s', (value, expected) => {
    expect(getRatingTone(value)).toBe(expected)
  })
})
