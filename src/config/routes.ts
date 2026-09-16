export const routes = {
  home: '/',
  ranking: '/ranking',
  results: '/results',
  live: '/live',
  liveRound: (roundId: string, season?: number) =>
    `/live?roundId=${encodeURIComponent(roundId)}${season ? `&season=${season}` : ""}`,
  compare: '/compare',
  fantasy: '/fantasy',
  about: '/about',
  privacyPolicy: '/privacy-policy',
  liveResults: (sessionKey: string, context?: string, roundId?: string, season?: number) => {
    const query = new URLSearchParams();
    if (context) query.set("context", context);
    if (roundId) query.set("roundId", roundId);
    if (season) query.set("season", String(season));
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return `/live/results/${encodeURIComponent(sessionKey)}${suffix}`;
  },
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
  { label: 'Fantasy', to: routes.fantasy },
  { label: 'About', to: routes.about },
] as const
