export const filterOptionQueryKeys = {
  all: ['filter-options'] as const,
  seasons: () => [...filterOptionQueryKeys.all, 'seasons'] as const,
  tracks: () => [...filterOptionQueryKeys.all, 'tracks'] as const,
  conditions: () => [...filterOptionQueryKeys.all, 'conditions'] as const,
  competitionClasses: () => [...filterOptionQueryKeys.all, 'competition-classes'] as const,
}
