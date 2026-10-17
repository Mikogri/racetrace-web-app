import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '../../../lib/api-client'
import { entityIdSchema, nullableNumberSchema, nullableStringSchema } from '../../../lib/validation'
import { roundRaceAnalyticsSchema } from '../../rounds/api/round-race-analytics-schema'
import { roundProfileQueryKey } from './analytics-query-keys'

export const riderIdentitySchema = z.object({
  position: z.number().int(),
  riderId: entityIdSchema,
  fullName: z.string(),
  countryCode: nullableStringSchema,
  teamId: entityIdSchema.nullish().transform((value) => value ?? null),
  teamName: nullableStringSchema,
});

export const roundSummarySchema = z.object({
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
  round: roundSummarySchema.nullable(),
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

export type RoundProfile = z.infer<typeof roundProfileSchema>;

export function useRoundProfile(season: number, category: string, roundId?: string) {
  return useQuery({
    queryKey: roundProfileQueryKey(season, category, roundId),
    queryFn: ({ signal }) => apiClient.get(
      "/api/v1/analytics/round-profile",
      roundProfileSchema,
      { signal, query: { season, category, roundId } },
    ),
    ...(roundId ? { placeholderData: keepPreviousData } : {}),
  });
}

export type RoundProfileWireContract = AssertApiContract<ApiSchema<'RoundProfileResponseDto'> extends z.input<typeof roundProfileSchema> ? true : false>
