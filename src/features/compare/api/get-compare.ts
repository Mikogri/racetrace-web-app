import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { serializeFilterValues as csv } from '../../../utils/metrics-api-query'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '../../../lib/api-client'
import { entityIdSchema, nullableNumberSchema, nullableStringSchema } from '../../../lib/validation'
import type { MetricsFilters } from '../../../types/domain'
import { compareQueryKeys } from './compare-query-keys'

const sectorGapSchema = z.object({
  trackId: entityIdSchema.nullish().transform((value) => value ?? null),
  trackName: nullableStringSchema,
  sectorIndex: z.number().int(),
  isFinishSector: z.boolean(),
  averageGap: z.number(),
  samplesCount: z.number().int(),
})

const compareRiderSchema = z.object({
  resultsAveragePosition: nullableNumberSchema,
  sectorGapSummary: z.array(z.object({ sectorIndex: z.number().int(), averageGap: nullableNumberSchema, samplesCount: z.number().int() })).optional().default([]),
  riderId: entityIdSchema,
  uciId: nullableStringSchema,
  firstName: nullableStringSchema,
  lastName: nullableStringSchema,
  fullName: z.string(),
  countryCode: nullableStringSchema,
  profileImageUrl: nullableStringSchema,
  age: z.number().int().nonnegative().nullish().transform((value) => value ?? null),
  currentCategory: nullableStringSchema.optional().transform((value) => value ?? null),
  categories: z.array(z.string()).optional().default([]),
  teamId: entityIdSchema.nullish().transform((value) => value ?? null),
  teamName: nullableStringSchema,
  teamCode: nullableStringSchema,
  winsCount: z.number().int(),
  podiumsCount: z.number().int(),
  top5Count: z.number().int(),
  top10Count: z.number().int(),
  rating: nullableNumberSchema,
  pace: nullableNumberSchema,
  consistency: nullableNumberSchema,
  confidence: z.number(),
  wonSplitsCount: z.number().int(),
  wonSectorsCount: z.number().int(),
  averageFinalPosition: nullableNumberSchema,
  averagePreFinalPosition: nullableNumberSchema,
  averageFinishGapToBestSelected: nullableNumberSchema,
  finishGapSamplesCount: z.number().int(),
  averageSectorGapsToBestSelected: z.array(sectorGapSchema),
  totalPoints: z.number().optional().default(0),
  pointsProgress: z.array(z.object({
    resultId: entityIdSchema,
    sessionId: entityIdSchema,
    roundId: entityIdSchema,
    date: nullableStringSchema,
    sessionType: nullableStringSchema,
    category: nullableStringSchema,
    awardedPoints: z.number(),
    cumulativePoints: z.number(),
  })).optional().default([]),
  roundMetrics: z.array(z.object({
    roundId: entityIdSchema,
    season: z.number().int().nullish().transform((value) => value ?? null),
    roundNumber: z.number().int().nullish().transform((value) => value ?? null),
    date: nullableStringSchema,
    trackId: entityIdSchema.nullish().transform((value) => value ?? null),
    trackName: nullableStringSchema,
    venueName: nullableStringSchema,
    competitionClassCode: nullableStringSchema,
    rating: nullableNumberSchema,
    pace: nullableNumberSchema,
    consistency: nullableNumberSchema,
    confidence: z.number(),
  })).optional().default([]),
})

const sectorResultSchema = z.object({
  sectorIndex: z.number().int(),
  isFinishSector: z.boolean(),
  time: nullableNumberSchema,
  gapToBestSelected: nullableNumberSchema,
  positionAmongSelected: z.number().int().nullish().transform((value) => value ?? null),
})

const sessionResultSchema = z.object({
  resultId: entityIdSchema,
  riderId: entityIdSchema,
  position: z.number().int().nullish().transform((value) => value ?? null),
  status: nullableStringSchema,
  isClassified: z.boolean(),
  teamId: entityIdSchema.nullish().transform((value) => value ?? null),
  teamName: nullableStringSchema,
  finalTime: nullableNumberSchema,
  gapToBestSelected: nullableNumberSchema,
  sectors: z.array(sectorResultSchema),
})

const compareSessionSchema = z.object({
  sessionId: entityIdSchema,
  roundId: entityIdSchema,
  season: z.number().int().nullish().transform((value) => value ?? null),
  roundNumber: z.number().int().nullish().transform((value) => value ?? null),
  sessionName: nullableStringSchema,
  sessionType: nullableStringSchema,
  category: nullableStringSchema,
  sessionDate: nullableStringSchema,
  trackId: entityIdSchema.nullish().transform((value) => value ?? null),
  trackName: nullableStringSchema,
  venueName: nullableStringSchema,
  countryCode: nullableStringSchema,
  condition: z.object({ id: entityIdSchema.nullish(), code: nullableStringSchema, name: nullableStringSchema }).nullable(),
  competitionClassId: entityIdSchema.nullish().transform((value) => value ?? null),
  competitionClassCode: nullableStringSchema,
  competitionClassName: nullableStringSchema,
  isCommon: z.boolean().optional().default(true),
  results: z.array(sessionResultSchema),
})

const compareResponseSchema = z.object({
  riders: z.array(compareRiderSchema),
  sessions: z.array(compareSessionSchema).optional(),
  commonSessions: z.array(compareSessionSchema),
  summary: z.object({
    ridersCount: z.number().int(),
    sessionsCount: z.number().int().optional(),
    commonSessionsCount: z.number().int(),
  }),
}).transform((value) => ({
  ...value,
  sessions: value.sessions ?? value.commonSessions,
  summary: {
    ...value.summary,
    sessionsCount: value.summary.sessionsCount ?? value.commonSessions.length,
  },
}))

export type CompareData = z.infer<typeof compareResponseSchema>
export type CompareRider = z.infer<typeof compareRiderSchema>


export function useCompare(riderIds: string[], filters: MetricsFilters) {
  const selectedRiderIds = [...new Set(riderIds)].slice(0, 2)
  const selectedCategory = filters.categories[0] ?? 'elite_men'
  return useQuery({
    queryKey: compareQueryKeys.detail(selectedRiderIds, { ...filters, categories: [selectedCategory] }),
    queryFn: async ({ signal }) => {
      const data = await apiClient.get('/api/v1/compare', compareResponseSchema, {
        signal,
        query: {
          riderIds: selectedRiderIds.join(','),
          seasons: csv(filters.seasons),
          tracks: csv(filters.tracks),
          conditions: csv(filters.conditions),
          competitionClassId: csv(filters.classes),
          category: selectedCategory,
        },
      })
      return data
    },
    enabled: selectedRiderIds.length === 2,
    placeholderData: keepPreviousData,
  })
}
export type CompareWireContract = AssertApiContract<ApiSchema<'CompareResponseDto'> extends z.input<typeof compareResponseSchema> ? true : false>
