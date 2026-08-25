export const routes = {
  home: '/',
  ranking: '/ranking',
  results: '/results',
  live: '/live',
  liveRound: (roundId: string, season?: number) =>
    `/live?roundId=${encodeURIComponent(roundId)}${season ? `&season=${season}` : ""}`,
  compare: '/compare',
  about: '/about',
  privacyPolicy: '/privacy-policy',
  liveResults: (sessionKey: string, context?: string, roundId?: string, season?: number) =>
    `/live/results/${encodeURIComponent(sessionKey)}${context ? `?context=${encodeURIComponent(context)}${roundId ? `&roundId=${encodeURIComponent(roundId)}` : ""}${season ? `&season=${season}` : ""}` : ""}`,
  round: (roundId: string) => `/results/rounds/${encodeURIComponent(roundId)}`,
  rider: (riderId: string) => `/riders/${encodeURIComponent(riderId)}`,
  riderResults: (riderId: string) => `/riders/${encodeURIComponent(riderId)}/results`,
  riderTracks: (riderId: string) => `/riders/${encodeURIComponent(riderId)}/tracks`,
} as const

export const navigationItems = [
  { label: 'Home', to: routes.home },
  { label: 'Results', to: routes.results },
  { label: 'Ranking', to: routes.ranking },
  { label: 'Live', to: routes.live },
  { label: 'Compare', to: routes.compare },
  { label: 'About', to: routes.about },
] as const
