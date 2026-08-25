export const standingsQueryKeys = {
  all: ['standings'] as const,
  list: (filters: Record<string, unknown>) => [...standingsQueryKeys.all, 'list', filters] as const,
}
