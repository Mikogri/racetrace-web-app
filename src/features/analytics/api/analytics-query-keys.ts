// Retain the existing cache identity shared with Home.
export const roundProfileQueryKey = (season: number, category: string, roundId?: string) =>
  ['home', 'round-profile', { season, category, roundId }] as const
