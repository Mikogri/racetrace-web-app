import { keepPreviousData, QueryClient } from '@tanstack/react-query'
import { ApiError } from '../types/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && ['aborted', 'validation'].includes(error.code)) {
          return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})
