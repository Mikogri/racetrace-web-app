import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { metricsApiQuery, serializeFilterValues as csv } from "../../../utils/metrics-api-query";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { GLOBAL_PAGE_SIZE } from "../../../config/pagination";
import {
  entityIdSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from "../../../lib/validation";
import type { MetricsFilters } from "../../../types/domain";
import { rankingQueryKeys } from "./ranking-query-keys";

const rankingRiderSchema = z.object({
  position: z.number().int(),
  riderId: entityIdSchema,
  uciId: nullableStringSchema,
  firstName: nullableStringSchema,
  lastName: nullableStringSchema,
  fullName: z.string(),
  countryCode: nullableStringSchema,
  teamId: entityIdSchema.nullish().transform((value) => value ?? null),
  teamName: nullableStringSchema,
  totalPoints: z.number(),
  rating: nullableNumberSchema,
  pace: nullableNumberSchema,
  consistency: nullableNumberSchema,
  confidence: z.number(),
  finalsCount: z.number().int(),
  qualifyingRate: z.number(),
  profileImageUrl: nullableStringSchema,
  positionChange: z.number().int().nullable().optional().transform((value) => value ?? null),
});

const rankingResponseSchema = z.object({
  items: z.array(rankingRiderSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  summary: z.object({
    sessionsCount: z.number().int(),
    finalsCount: z.number().int(),
    ridersCount: z.number().int(),
  }),
  comparisonBasis: z
    .enum(["previousRound", "defaultFilters", "previousFilters"])
    .nullable()
    .optional()
    .transform((value) => value ?? null),
});

export type RankingResponse = z.infer<typeof rankingResponseSchema>;

export type RankingSort =
  | "position"
  | "fullName"
  | "totalPoints"
  | "rating"
  | "pace"
  | "consistency"
  | "confidence"
  | "qualifyingRate"
  | "finalsCount";

type RankingParams = {
  filters: MetricsFilters;
  search: string;
  page: number;
  pageSize?: number;
  sortBy: RankingSort;
  sortDirection: "asc" | "desc";
  comparison?: "previousRound" | "defaultFilters" | "previousFilters";
  comparisonFilters?: {
    filters: MetricsFilters;
    search: string;
  };
};


export function useRanking(params: RankingParams) {
  const queryClient = useQueryClient();
  const refreshNextRequest = useRef(false);
  const query = useQuery({
    queryKey: rankingQueryKeys.list(params),
    placeholderData: keepPreviousData,
    structuralSharing: false,
    queryFn: async ({ signal }) => {
      const refresh = refreshNextRequest.current;
      refreshNextRequest.current = false;
      return apiClient.get("/api/v1/ranking", rankingResponseSchema, {
            signal,
            query: {
              refresh: refresh ? 1 : undefined,
              ...metricsApiQuery(params.filters),
              category: params.filters.categories[0] ?? "elite_men",
              search: params.search,
              page: params.page,
              pageSize: params.pageSize ?? GLOBAL_PAGE_SIZE,
              sortBy: params.sortBy,
              sortDirection: params.sortDirection,
              comparison: params.comparison,
              comparisonSeason: csv(params.comparisonFilters?.filters.seasons ?? []),
              comparisonTrackId: csv(params.comparisonFilters?.filters.tracks ?? []),
              comparisonConditionId: csv(params.comparisonFilters?.filters.conditions ?? []),
              comparisonCompetitionClassId: csv(params.comparisonFilters?.filters.classes ?? []),
              comparisonCategory: params.comparisonFilters?.filters.categories[0],
              comparisonSearch: params.comparisonFilters?.search,
            },
          });
    },
  });
  return {
    ...query,
    clearCache: () => {
      queryClient.removeQueries({ queryKey: rankingQueryKeys.lists(), type: "inactive" });
      refreshNextRequest.current = true;
      return query.refetch();
    },
  };
}
export type RankingWireContract = AssertApiContract<ApiSchema<'RankingResponseDto'> extends z.input<typeof rankingResponseSchema> ? true : false>
