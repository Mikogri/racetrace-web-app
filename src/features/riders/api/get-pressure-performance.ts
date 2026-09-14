import { metricsApiQuery } from "../../../utils/metrics-api-query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { entityIdSchema, nullableNumberSchema, nullableStringSchema } from "../../../lib/validation";
import type { MetricsFilters } from "../../../types/domain";
import { riderQueryKeys } from "./rider-query-keys";

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

export function usePressurePerformance(riderId: string, filters: MetricsFilters) {
  return useQuery({
    queryKey: riderQueryKeys.pressurePerformance(riderId, filters),
    queryFn: ({ signal }) => apiClient.get(
      `/api/v1/analytics/riders/${encodeURIComponent(riderId)}/pressure-performance`,
      pressurePerformanceSchema,
      {
        signal,
        query: metricsApiQuery(filters),
      },
    ),
    placeholderData: keepPreviousData,
    structuralSharing: false,
  });
}
