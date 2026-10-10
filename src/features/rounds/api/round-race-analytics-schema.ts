import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { z } from "zod";
import { entityIdSchema } from "../../../lib/validation";

const numberOrNull = z.number().nullable();

export const roundRaceAnalyticsSchema = z.object({
  methodVersion: z.string(),
  sectorEfficiency: z.array(z.object({
    sectorIndex: z.number().int(), ridersCount: z.number().int(), positionsPerSecond: numberOrNull,
  })),
  chaos: z.object({
    score: numberOrNull, starters: z.number().int(), dnfCount: z.number().int(), incidentCount: z.number().int(),
    components: z.array(z.object({ key: z.string(), score: numberOrNull, weight: z.number(), sampleSize: z.number().int() })),
  }),
  correlation: z.object({
    preFinalSession: z.string().nullable(), spearman: numberOrNull,
    points: z.array(z.object({ riderId: entityIdSchema, fullName: z.string(), preFinalPosition: z.number().int(), finalPosition: z.number().int() })),
  }),
  winningMargin: z.object({
    winnerId: entityIdSchema, winnerName: z.string(), runnerUpId: entityIdSchema, runnerUpName: z.string(), marginSeconds: z.number(),
    sectors: z.array(z.object({ sectorIndex: z.number().int(), gapSeconds: z.number(), sharePercent: numberOrNull })),
  }).nullable(),
  runEfficiency: z.object({
    riderId: entityIdSchema, fullName: z.string(), sectorsCount: z.number().int(), measuredSectors: z.number().int(),
    sectorsWon: z.number().int(), sectorsTop3: z.number().int(), averageSectorPosition: numberOrNull, sectorsFor80PercentGain: numberOrNull,
    sectorsWonPercent: numberOrNull.optional(), sectorsTop3Percent: numberOrNull.optional(),
  }).nullable(),
  distribution: z.object({
    ridersCount: z.number().int(), classifiedCount: z.number().int(), median: numberOrNull,
    bins: z.array(z.object({ from: z.number(), to: z.number(), count: z.number().int() })),
    outliers: z.array(z.object({ riderId: entityIdSchema, fullName: z.string(), pace: z.number() })),
  }),
});

export type RoundRaceAnalytics = z.infer<typeof roundRaceAnalyticsSchema>;
export type RoundAnalyticsWireContract = AssertApiContract<ApiSchema<'RoundRaceAnalyticsDto'> extends z.input<typeof roundRaceAnalyticsSchema> ? true : false>
