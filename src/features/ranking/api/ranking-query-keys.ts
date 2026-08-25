export const rankingQueryKeys = {
  all: ['ranking'] as const,
  lists: () => [...rankingQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...rankingQueryKeys.lists(), filters] as const,
}
