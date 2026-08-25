import { describe, expect, it } from 'vitest'
import { formatGap, formatRaceTime } from './formatters'

describe('race formatters', () => {
  it('formats race time without losing fractions', () => {
    expect(formatRaceTime(221.19)).toBe('3:41.19')
    expect(formatRaceTime(126.234)).toBe('2:06.23')
    expect(formatRaceTime(59.999)).toBe('1:00.00')
  })

  it('preserves missing values', () => {
    expect(formatRaceTime(null)).toBe('—')
    expect(formatGap(undefined)).toBe('—')
  })

  it('formats winning and signed gaps', () => {
    expect(formatGap(0)).toBe('Winner')
    expect(formatGap(2.415)).toBe('+2.415')
    expect(formatGap(-0.314)).toBe('−0.314')
    expect(formatGap(1.421, 2)).toBe('+1.42')
  })
})
