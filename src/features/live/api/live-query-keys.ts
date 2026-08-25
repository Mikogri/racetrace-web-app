export const liveQueryKeys = {
  all: ['live'] as const,
  rounds: (filters: Record<string, unknown>) => [...liveQueryKeys.all, 'rounds', filters] as const,
  catalog: (context: string) => [...liveQueryKeys.all, 'chronorace', context, 'catalog'] as const,
  chronoResults: (context: string, key: string) => [...liveQueryKeys.all, 'chronorace', context, 'results', key] as const,
  riderIds: (uciIds: string[]) => [...liveQueryKeys.all, 'rider-ids', uciIds] as const,
}
