import { roundProfileQueryKey } from "../../analytics/api/analytics-query-keys";

export const homeQueryKeys = {
  all: ["home"] as const,
  seasonOverview: (season: number) =>
    [...homeQueryKeys.all, "season-overview", season] as const,
  roundProfile: roundProfileQueryKey,
  ranking: (season: number, category: string) =>
    [...homeQueryKeys.all, "ranking", { season, category }] as const,
  podiumPredictor: (season: number, category: string) =>
    [...homeQueryKeys.all, "podium-predictor", { season, category }] as const,
};
