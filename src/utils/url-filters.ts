import type { MetricsFilters } from '../types/domain'

const filterKeys = ['seasons', 'tracks', 'conditions', 'classes', 'categories'] as const

export function readMetricsFilters(searchParams: URLSearchParams): MetricsFilters {
  const filters = Object.fromEntries(
    filterKeys.map((key) => [
      key,
      searchParams
        .get(key)
        ?.split(',')
        .map((value) => value.trim())
        .filter(Boolean) ?? [],
    ]),
  ) as MetricsFilters

  return {
    ...filters,
    seasons: filters.seasons.length > 0 ? filters.seasons : [String(new Date().getUTCFullYear())],
    categories: filters.categories.length > 0 ? filters.categories : ['elite_men'],
  }
}

export function writeMetricsFilters(
  current: URLSearchParams,
  filters: MetricsFilters,
): URLSearchParams {
  const next = new URLSearchParams(current)
  filterKeys.forEach((key) => {
    const values = filters[key]
    if (values.length > 0) next.set(key, values.join(','))
    else next.delete(key)
  })
  return next
}
