import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { MetricsFilters } from '../types/domain'
import { readMetricsFilters, writeMetricsFilters } from '../utils/url-filters'

export function useMetricsFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => readMetricsFilters(searchParams), [searchParams])
  const setFilters = useCallback(
    (nextFilters: MetricsFilters) => {
      const next = writeMetricsFilters(searchParams, nextFilters)
      next.delete('page')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  return { filters, setFilters }
}
