import { describe, expect, it } from 'vitest'
import { readMetricsFilters, writeMetricsFilters } from './url-filters'

describe('metrics filters in the URL', () => {
  it('reads comma-separated filters', () => {
    const result = readMetricsFilters(
      new URLSearchParams('seasons=2026,2025&tracks=10&categories=elite_men'),
    )
    expect(result.seasons).toEqual(['2026', '2025'])
    expect(result.tracks).toEqual(['10'])
    expect(result.categories).toEqual(['elite_men'])
  })

  it('updates known filters without removing unrelated parameters', () => {
    const result = writeMetricsFilters(new URLSearchParams('search=bruni&tracks=old'), {
      seasons: ['2026'],
      tracks: [],
      conditions: ['2'],
      classes: [],
      categories: [],
    })
    expect(result.get('search')).toBe('bruni')
    expect(result.get('seasons')).toBe('2026')
    expect(result.get('conditions')).toBe('2')
    expect(result.has('tracks')).toBe(false)
  })
})
