import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '../../../lib/api-client'
import { USE_SIMULATED_API_DATA } from '../../../config/demo-data'
import { filterOptionQueryKeys } from './filter-option-query-keys'

// Shared dictionaries stay fresh across navigation, but refresh after five minutes.
export const filterQueryPolicy = {
  staleTime: 5 * 60_000,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const

const seasonsSchema = z.object({
  items: z.array(z.number().int().min(1990).max(2100)),
})

export function seasonsQueryOptions() {
  return {
    queryKey: filterOptionQueryKeys.seasons(),
    queryFn: ({ signal }: { signal: AbortSignal }) => USE_SIMULATED_API_DATA
      ? Promise.resolve({ items: [new Date().getUTCFullYear()] })
      : apiClient.get('/api/v1/rounds/seasons', seasonsSchema, { signal }),
    ...filterQueryPolicy,
  }
}

export function useSeasons() {
  return useQuery(seasonsQueryOptions())
}
