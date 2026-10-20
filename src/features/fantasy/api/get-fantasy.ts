import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '../../../lib/api-client'
import { entityIdSchema } from '../../../lib/validation'

const nullableNumber = z.number().finite().nullable()
export const fantasyRiderSchema = z.object({
  pinkbikeExternalId: entityIdSchema,
  riderId: entityIdSchema.nullable(),
  name: z.string(),
  countryCode: z.string().nullable(),
  gender: z.enum(['male', 'female']).nullable(),
  price: nullableNumber,
  pinkbikeSeasonPoints: nullableNumber,
  entryStatus: z.enum(['unknown', 'entered', 'not_entered']),
  expectedFinalPoints: nullableNumber,
  expectedQ1Bonus: nullableNumber,
  expectedFantasyPoints: nullableNumber,
  predictedPosition: nullableNumber,
  confidence: nullableNumber,
  isRecommended: z.boolean(),
  warnings: z.array(z.string()),
})

export const fantasyCurrentSchema = z.object({
  status: z.string(),
  predictionEngineVersion: z.string(),
  fantasyProjectionVersion: z.string(),
  priceSnapshotId: z.string().nullable(),
  sourceUrl: z.url(),
  season: z.number().int(),
  round: z.object({
    roundId: entityIdSchema,
    roundNumber: z.number().int().nullable(),
    venue: z.string().nullable(),
    trackName: z.string().nullable(),
    startDate: z.string().nullable(),
  }).nullable(),
  riders: z.array(fantasyRiderSchema),
  recommendation: z.object({
    riders: z.array(fantasyRiderSchema),
    totalPrice: z.number().nonnegative(),
    remainingBudget: z.number().nonnegative(),
    expectedFantasyPoints: z.number().nonnegative(),
  }).nullable(),
  warnings: z.array(z.string()),
  fetchedAtUtc: z.string().nullable(),
})

const scoringEntry = z.object({ position: z.number().int().positive(), points: z.number().nonnegative() })
export const fantasyRulesSchema = z.object({
  season: z.number().int(),
  version: z.string(),
  budget: z.number().positive(),
  teamSize: z.number().int().positive(),
  men: z.number().int().nonnegative(),
  women: z.number().int().nonnegative(),
  finalPlacementPoints: z.array(z.object({ position: z.number().int().positive(), menPoints: nullableNumber, womenPoints: nullableNumber })),
  q1Bonus: z.array(scoringEntry),
  dynamicPricing: z.boolean(),
  sourceUrl: z.url(),
})

export type FantasyRider = z.infer<typeof fantasyRiderSchema>
export type FantasyCurrent = z.infer<typeof fantasyCurrentSchema>

export function useFantasyCurrent() {
  return useQuery({
    queryKey: ['fantasy', 'current'],
    queryFn: ({ signal }) => apiClient.get('/api/v1/fantasy/current', fantasyCurrentSchema, { signal }),
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}

export function useFantasyRules() {
  return useQuery({
    queryKey: ['fantasy', 'rules'],
    queryFn: ({ signal }) => apiClient.get('/api/v1/fantasy/rules', fantasyRulesSchema, { signal }),
    staleTime: 300_000,
  })
}
export type FantasyCurrentWireContract = AssertApiContract<ApiSchema<'FantasyCurrentDto'> extends z.input<typeof fantasyCurrentSchema> ? true : false>
export type FantasyRulesWireContract = AssertApiContract<ApiSchema<'FantasyRulesDto'> extends z.input<typeof fantasyRulesSchema> ? true : false>
