import type { ApiSchema, AssertApiContract } from "../../../types/api-contract";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { entityIdSchema, nullableStringSchema } from "../../../lib/validation";
import { resultsQueryKeys } from "./results-query-keys";

const RESULTS_PAGE_SIZE = 100;

export const roundListItemSchema = z.object({
  roundId: entityIdSchema,
  roundNumber: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
  season: z.number().int(),
  contextName: nullableStringSchema,
  imageUrl: nullableStringSchema,
  trackId: entityIdSchema,
  trackName: nullableStringSchema,
  venueId: entityIdSchema.nullish().transform((value) => value ?? null),
  venueName: nullableStringSchema,
  countryCode: nullableStringSchema,
  startDate: nullableStringSchema,
  endDate: nullableStringSchema,
  status: z.string(),
  competitionClassId: entityIdSchema
    .nullish()
    .transform((value) => value ?? null),
  competitionClassCode: nullableStringSchema,
  competitionClassName: nullableStringSchema,
  competitionClassAbbreviation: nullableStringSchema,
  competitionClassPriority: z
    .number()
    .int()
    .nullish()
    .transform((value) => value ?? null),
});

const roundsResponseSchema = z.object({
  items: z.array(roundListItemSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type RoundListItem = z.infer<typeof roundListItemSchema>;

export function useRounds(params: { season: number; page: number }) {
  return useQuery({
    queryKey: resultsQueryKeys.list(params),
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      apiClient.get("/api/v1/rounds", roundsResponseSchema, {
        signal,
        query: {
          season: params.season,
          sortBy: "roundNumber",
          sortDirection: "asc",
          page: 1,
          pageSize: RESULTS_PAGE_SIZE,
        },
      }),
  });
}
export type RoundsWireContract = AssertApiContract<
  ApiSchema<"PublicPagedResponseOfRoundListItemDto"> extends z.input<
    typeof roundsResponseSchema
  >
    ? true
    : false
>;
