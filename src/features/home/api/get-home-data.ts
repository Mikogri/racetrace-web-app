import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import {
  nullableNumberSchema,
} from "../../../lib/validation";
import type { MetricsFilters } from "../../../types/domain";
import { useRanking } from "../../ranking/api/get-ranking";
import { homeQueryKeys } from "./home-query-keys";
import { riderIdentitySchema, roundSummarySchema as homeRoundSchema, type RoundProfile } from "../../analytics/api/get-round-profile";
export { useRoundProfile, roundSummarySchema as homeRoundSchema, type RoundProfile } from "../../analytics/api/get-round-profile";


const seasonProgressSchema = z.object({
  roundsCount: z.number().int(),
  completedRoundsCount: z.number().int(),
  finalWinnersCount: z.number().int(),
  categoriesCount: z.number().int(),
});

const seasonOverviewSchema = z.object({
  season: z.number().int(),
  nextRound: homeRoundSchema.nullable(),
  lastCompletedRound: homeRoundSchema.nullable(),
  progress: seasonProgressSchema,
});


const predictionSchema = riderIdentitySchema.extend({
  podiumProbability: z.number(),
  predictionScore: z.number(),
  currentSeasonRating: nullableNumberSchema,
  lastTrackPace: nullableNumberSchema,
  previousSeasonRating: nullableNumberSchema,
  confidence: z.number(),
});

const podiumPredictorSchema = z.object({
  season: z.number().int(),
  category: z.string(),
  round: homeRoundSchema.nullable(),
  items: z.array(predictionSchema),
});

export type SeasonOverview = z.infer<typeof seasonOverviewSchema>;
export type HomePrediction = z.infer<typeof podiumPredictorSchema>;

export type HomeSummary = {
  season: number;
  category: string;
  nextRound: SeasonOverview["nextRound"];
  lastCompletedRound: RoundProfile["round"];
  lastRoundResults: Array<z.infer<typeof riderIdentitySchema> & {
    resultId: string;
    time: number | null;
    gapToLeader: number | null;
  }>;
  seasonTopRated: Array<z.infer<typeof riderIdentitySchema> & {
    rating: number;
    pace: number | null;
    consistency: number | null;
    confidence: number;
  }>;
  currentStandings: Array<z.infer<typeof riderIdentitySchema> & { points: number }>;
};

export function useSeasonOverview(season: number) {
  return useQuery({
    queryKey: homeQueryKeys.seasonOverview(season),
    queryFn: ({ signal }) => apiClient.get(
      `/api/v1/seasons/${season}/overview`,
      seasonOverviewSchema,
      { signal },
    ),
  });
}


const rankingFilters = (season: number, category: string): MetricsFilters => ({
  seasons: [String(season)],
  tracks: [],
  conditions: [],
  classes: [],
  categories: [category],
});

export function useHomeRanking(
  season: number,
  category: string,
  sortBy: "rating" | "totalPoints",
) {
  return useRanking({
    filters: rankingFilters(season, category),
    search: "",
    page: 1,
    pageSize: 5,
    sortBy,
    sortDirection: "desc",
  });
}

export function usePodiumPredictor(season: number, category: string) {
  return useQuery({
    queryKey: homeQueryKeys.podiumPredictor(season, category),
    queryFn: ({ signal }) => apiClient.get(
      "/api/v1/podium-predictor",
      podiumPredictorSchema,
      { signal, query: { season, category } },
    ),
  });
}
export type SeasonOverviewWireContract = AssertApiContract<ApiSchema<'SeasonOverviewResponseDto'> extends z.input<typeof seasonOverviewSchema> ? true : false>
export type PodiumPredictorWireContract = AssertApiContract<ApiSchema<'PodiumPredictionResponseDto'> extends z.input<typeof podiumPredictorSchema> ? true : false>
