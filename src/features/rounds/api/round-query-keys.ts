export const roundQueryKeys = {
  all: ['rounds'] as const,
  lists: () => [...roundQueryKeys.all, 'list'] as const,
  detail: (roundId: string) => [...roundQueryKeys.all, 'detail', roundId] as const,
  sessions: (roundId: string) => [...roundQueryKeys.detail(roundId), 'sessions'] as const,
  results: (roundId: string, filters: Record<string, unknown>) =>
    [...roundQueryKeys.detail(roundId), 'results', filters] as const,
}
