import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { z } from "zod";
import { entityIdSchema, nullableNumberSchema, nullableStringSchema } from "../../../lib/validation";

export const pressurePerformanceSchema = z.object({
  riderId: entityIdSchema,
  pressurePerformance: nullableNumberSchema,
  pressureTrend: z.string(),
  sampleCount: z.number().int(),
  evidence: z.string(),
  summary: z.object({
    qualifyingPace: nullableNumberSchema,
    finalPace: nullableNumberSchema,
    delta: nullableNumberSchema,
    tendency: z.string(),
    pairedRounds: z.number().int(),
  }),
  points: z.array(z.object({
    roundId: entityIdSchema,
    season: z.number().int().nullable(),
    roundNumber: z.number().int().nullable(),
    date: nullableStringSchema,
    venueName: nullableStringSchema,
    roundName: nullableStringSchema,
    preFinalSession: nullableStringSchema,
    preFinalPace: nullableNumberSchema,
    qualifyingPace: nullableNumberSchema,
    finalPace: nullableNumberSchema,
    delta: nullableNumberSchema,
  })),
});

export type PressurePerformance = z.infer<typeof pressurePerformanceSchema>;

export type PressurePerformanceWireContract = AssertApiContract<ApiSchema<'PressurePerformanceResponseDto'> extends z.input<typeof pressurePerformanceSchema> ? true : false>
