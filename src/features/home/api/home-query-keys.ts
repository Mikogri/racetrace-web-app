export const homeQueryKeys = {
  all: ['home'] as const,
  seasonOverview: (season: number) =>
    [...homeQueryKeys.all, 'season-overview', season] as const,
  roundProfile: (season: number, category: string) =>
    [...homeQueryKeys.all, 'round-profile', { season, category }] as const,
  podiumPredictor: (season: number, category: string) =>
    [...homeQueryKeys.all, 'podium-predictor', { season, category }] as const,
}
