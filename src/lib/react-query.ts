import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { ApiError } from "../types/api";

export function shouldRetryQuery(failureCount: number, error: Error) {
  if (failureCount >= 2 || !(error instanceof ApiError)) return false;
  if (error.code === "network" || error.code === "timeout") return true;
  return (
    error.code === "http" &&
    error.status !== null &&
    [408, 429, 500, 502, 503, 504].includes(error.status)
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      placeholderData: keepPreviousData,
      retry: shouldRetryQuery,
      retryDelay: (attempt, error) =>
        error instanceof ApiError && error.retryAfterMs !== null
          ? Math.max(1000, error.retryAfterMs)
          : Math.min(1000 * 2 ** attempt, 30_000),
    },
    mutations: {
      retry: false,
    },
  },
});
