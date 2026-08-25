import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import {
  entityIdSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from "../../../lib/validation";
import type { MetricsFilters } from "../../../types/domain";
import { riderQueryKeys } from "./rider-query-keys";
import { pressurePerformanceSchema } from "./get-pressure-performance";
import { riderSessionResultsSchema } from "./get-rider-sessions";
import { riderTeamHistorySchema } from "./get-rider-team-history";

const sessionPositionSchema = z.object({
  roundId: entityIdSchema,
  sessionId: entityIdSchema,
  sessionType: nullableStringSchema,
  position: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
});

const speedGroupSchema = z.object({
  topSpeed: nullableNumberSchema,
  averageSpeed: nullableNumberSchema,
});

const statisticsSchema = z.object({
  riderId: entityIdSchema,
  uciId: nullableStringSchema,
  firstName: nullableStringSchema,
  lastName: nullableStringSchema,
  fullName: z.string(),
  profileImageUrl: nullableStringSchema,
  countryCode: nullableStringSchema,
  teamId: entityIdSchema.nullish().transform((value) => value ?? null),
  teamName: nullableStringSchema,
  teamCode: nullableStringSchema,
  currentCategory: nullableStringSchema,
  gender: nullableStringSchema.optional().transform((value) => value ?? null),
  sex: nullableStringSchema.optional().transform((value) => value ?? null),
  age: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  rating: nullableNumberSchema,
  pace: nullableNumberSchema,
  consistency: nullableNumberSchema,
  confidence: z.number(),
  averagePosition: nullableNumberSchema,
  totalPoints: z.number(),
  rankingPosition: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  qualifyingPositions: z.array(sessionPositionSchema),
  finalPositions: z.array(sessionPositionSchema),
  startsCount: z.number().int(),
  winsCount: z.number().int(),
  podiumsCount: z.number().int(),
  top5Count: z.number().int(),
  top10Count: z.number().int(),
  wonSplitsCount: z.number().int(),
  wonSectorsCount: z.number().int(),
  preFinalWonSplitsCount: z.number().int(),
  preFinalWonSectorsCount: z.number().int(),
  finalWonSplitsCount: z.number().int(),
  finalWonSectorsCount: z.number().int(),
  speed: z
    .object({ qualification: speedGroupSchema, final: speedGroupSchema })
    .nullish()
    .transform((value) => value ?? null),
  averageQualifyingPosition: nullableNumberSchema,
  averageQualifying1Position: nullableNumberSchema,
  averageQualifying2Position: nullableNumberSchema,
  averageSemiFinalPosition: nullableNumberSchema,
  averageFinalPosition: nullableNumberSchema,
  averageSectorTimes: z.array(
    z.object({
      sectorIndex: z.number().int(),
      averageTime: z.number(),
      samplesCount: z.number().int(),
    }),
  ),
  averageFinishTime: nullableNumberSchema,
});

const conditionSchema = z
  .object({
    id: entityIdSchema.nullish(),
    code: nullableStringSchema,
    name: nullableStringSchema,
  })
  .nullable();

const roundResultSchema = z.object({
  roundId: entityIdSchema,
  roundNumber: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  season: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  competitionClassId: entityIdSchema
    .nullish()
    .transform((value) => value ?? null),
  competitionClassCode: nullableStringSchema,
  competitionClassName: nullableStringSchema,
  competitionClassAbbreviation: nullableStringSchema,
  condition: conditionSchema,
  roundStartDate: nullableStringSchema,
  trackId: entityIdSchema.nullish().transform((value) => value ?? null),
  trackName: nullableStringSchema,
  venueId: entityIdSchema.nullish().transform((value) => value ?? null),
  venueName: nullableStringSchema,
  countryCode: nullableStringSchema,
  rating: nullableNumberSchema,
  pace: nullableNumberSchema,
  consistency: nullableNumberSchema,
  confidence: z.number(),
  qualifyingPosition: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  qualifying1Position: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  qualifying2Position: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  semiFinalPosition: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  finalPosition: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  awardedPoints: z.number(),
});

const trackStatisticsSchema = z.object({
  trackId: entityIdSchema,
  trackName: nullableStringSchema,
  venueId: entityIdSchema.nullish().transform((value) => value ?? null),
  venueName: nullableStringSchema,
  countryCode: nullableStringSchema,
  rating: nullableNumberSchema,
  pace: nullableNumberSchema,
  consistency: nullableNumberSchema,
  confidence: z.number(),
  averageQualifyingPosition: nullableNumberSchema,
  averageQualifying1Position: nullableNumberSchema,
  averageQualifying2Position: nullableNumberSchema,
  averageSemiFinalPosition: nullableNumberSchema,
  averageFinalPosition: nullableNumberSchema,
  startsCount: z.number().int(),
});

const riderOverviewSchema = z.object({
  statistics: statisticsSchema,
  roundResults: z.array(roundResultSchema),
  trackStatistics: z.array(trackStatisticsSchema),
  sessionResults: riderSessionResultsSchema,
  pressurePerformance: pressurePerformanceSchema,
  teamHistory: riderTeamHistorySchema,
});

export type RiderOverview = z.infer<typeof riderOverviewSchema>;

const csv = (values: string[]) =>
  values.length > 0 ? values.join(",") : undefined;

export function useRiderOverview(riderId: string, filters: MetricsFilters) {
  return useQuery({
    queryKey: riderQueryKeys.overview(riderId, filters),
    queryFn: ({ signal }) =>
      apiClient.get(
        `/api/v1/riders/${encodeURIComponent(riderId)}/overview`,
        riderOverviewSchema,
        {
          signal,
          query: {
            season: csv(filters.seasons),
            trackId: csv(filters.tracks),
            conditionId: csv(filters.conditions),
            competitionClassId: csv(filters.classes),
            category: filters.categories[0],
          },
        },
      ),
    placeholderData: keepPreviousData,
    structuralSharing: false,
  });
}
