import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import {
  entityIdSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from "../../../lib/validation";
import type { MetricsFilters } from "../../../types/domain";
import { useRanking } from "../../ranking/api/get-ranking";
import { homeQueryKeys } from "./home-query-keys";
import { roundRaceAnalyticsSchema } from "../../rounds/api/round-race-analytics-schema";

const riderIdentitySchema = z.object({
  position: z.number().int(),
  riderId: entityIdSchema,
  fullName: z.string(),
  countryCode: nullableStringSchema,
  teamId: entityIdSchema.nullish().transform((value) => value ?? null),
  teamName: nullableStringSchema,
});

export const homeRoundSchema = z.object({
  roundId: entityIdSchema,
  season: z.number().int(),
  roundNumber: z.number().int().nullish().transform((value) => value ?? null),
  startDate: nullableStringSchema,
  endDate: nullableStringSchema,
  status: z.string(),
  trackId: entityIdSchema.nullish().transform((value) => value ?? null),
  trackName: nullableStringSchema,
  venueName: nullableStringSchema,
  countryCode: nullableStringSchema,
  trackLengthMeters: nullableNumberSchema,
  averageSlope: nullableNumberSchema,
  competitionClassId: entityIdSchema.nullish().transform((value) => value ?? null),
  competitionClassCode: nullableStringSchema,
  competitionClassName: nullableStringSchema,
  competitionClassAbbreviation: nullableStringSchema.optional().transform((value) => value ?? null),
  competitionClassPriority: z.number().int().nullish().transform((value) => value ?? null),
});

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

const roundProfileResultSchema = riderIdentitySchema.extend({
  resultId: entityIdSchema,
  raceTime: nullableNumberSchema,
  gapToLeader: nullableNumberSchema,
  topSpeed: nullableNumberSchema,
});

const spreadPointSchema = z.object({
  position: z.number().int(),
  raceTime: z.number(),
  gapToLeader: z.number(),
  gapPercent: z.number(),
  previousPosition: z.number().int(),
  incrementalSpread: nullableNumberSchema,
  incrementalSpreadPercent: nullableNumberSchema,
});

const roundProfileSchema = z.object({
  analytics: roundRaceAnalyticsSchema.nullish().transform((value) => value ?? null),
  season: z.number().int(),
  category: z.string(),
  round: homeRoundSchema.nullable(),
  sessionId: entityIdSchema.nullish().transform((value) => value ?? null),
  results: z.array(roundProfileResultSchema),
  fieldSpread: z.object({
    fieldSize: z.number().int(),
    classification: z.string(),
    p10GapPercent: nullableNumberSchema,
    points: z.array(spreadPointSchema),
  }),
  trackFingerprint: z.object({
    positionSpread: z.array(spreadPointSchema).default([]),
    positionSpreadFullPosition: z.number().int().optional(),
    mostDecisiveSector: z.number().int().nullable(),
    sectors: z.array(z.object({
      sectorIndex: z.number().int(),
      label: z.string(),
      ridersCount: z.number().int(),
      scoreSpread: z.number(),
      decisiveness: z.number(),
      relativeImpact: z.number(),
    })),
  }),
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
export type RoundProfile = z.infer<typeof roundProfileSchema>;
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
  seasonProgress: SeasonOverview["progress"];
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

export function useRoundProfile(season: number, category: string, roundId?: string) {
  return useQuery({
    queryKey: homeQueryKeys.roundProfile(season, category, roundId),
    queryFn: ({ signal }) => apiClient.get(
      "/api/v1/analytics/round-profile",
      roundProfileSchema,
      { signal, query: { season, category, roundId } },
    ),
    ...(roundId ? { placeholderData: keepPreviousData } : {}),
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
export type RoundProfileWireContract = AssertApiContract<ApiSchema<'RoundProfileResponseDto'> extends z.input<typeof roundProfileSchema> ? true : false>
export type PodiumPredictorWireContract = AssertApiContract<ApiSchema<'PodiumPredictionResponseDto'> extends z.input<typeof podiumPredictorSchema> ? true : false>
