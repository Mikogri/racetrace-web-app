import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { GLOBAL_PAGE_SIZE } from "../../../config/pagination";
import { entityIdSchema, nullableStringSchema } from "../../../lib/validation";
import { sessionResultsSchema } from "../../live/api/get-live";
import { roundQueryKeys } from "./round-query-keys";

const relatedSchema = z
  .object({
    id: entityIdSchema.optional(),
    code: z.string().nullish(),
    name: z.string().nullish(),
    venue: z.string().nullish(),
    country_code: z.string().nullish(),
  })
  .passthrough()
  .nullish();

const roundRawSchema = z
  .object({
    id: entityIdSchema.optional(),
    roundId: entityIdSchema.optional(),
    round_number: z.number().int().nullish(),
    roundNumber: z.number().int().nullish(),
    season_year: z.number().int().nullish(),
    season: z.number().int().nullish(),
    context_name: z.string().nullish(),
    start_date: z.string().nullish(),
    startDate: z.string().nullish(),
    end_date: z.string().nullish(),
    endDate: z.string().nullish(),
    status: z.string().nullish(),
    tracks: relatedSchema,
    trackName: z.string().nullish(),
    venueName: z.string().nullish(),
    countryCode: z.string().nullish(),
    competition_class: relatedSchema,
    competition_levels: relatedSchema,
    competitionClassName: z.string().nullish(),
    conditions: relatedSchema,
  })
  .passthrough()
  .transform((value) => ({
    id: value.roundId ?? value.id ?? "",
    roundNumber: value.roundNumber ?? value.round_number ?? null,
    season: value.season ?? value.season_year ?? null,
    title:
      value.venueName ??
      value.tracks?.venue ??
      value.trackName ??
      value.tracks?.name ??
      value.context_name ??
      "Round details",
    trackName: value.trackName ?? value.tracks?.name ?? null,
    venueName: value.venueName ?? value.tracks?.venue ?? null,
    countryCode: value.countryCode ?? value.tracks?.country_code ?? null,
    startDate: value.startDate ?? value.start_date ?? null,
    endDate: value.endDate ?? value.end_date ?? null,
    status: value.status ?? "unknown",
    competitionName:
      value.competitionClassName ??
      value.competition_class?.name ??
      value.competition_levels?.name ??
      null,
    conditionName: value.conditions?.name ?? null,
  }));

const commonSessionSchema = z.object({
  sessionId: entityIdSchema,
  roundId: entityIdSchema,
  sessionType: nullableStringSchema,
  category: nullableStringSchema,
  sessionDate: nullableStringSchema,
  riderIds: z.array(entityIdSchema),
});

const sessionsResponseSchema = z.object({
  items: z.array(commonSessionSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type RoundDetails = z.infer<typeof roundRawSchema>;
export type RoundSession = z.infer<typeof commonSessionSchema>;

export function useRoundDetails(roundId: string) {
  return useQuery({
    queryKey: roundQueryKeys.detail(roundId),
    queryFn: ({ signal }) =>
      apiClient.get(
        `/api/v1/rounds/${encodeURIComponent(roundId)}`,
        roundRawSchema,
        {
          signal,
          query: { include: "track,categories,conditions,competition_rank" },
        },
      ),
  });
}

export function useRoundSessions(roundId: string) {
  return useQuery({
    queryKey: roundQueryKeys.sessions(roundId),
    queryFn: ({ signal }) =>
      apiClient.get(
        `/api/v1/rounds/${encodeURIComponent(roundId)}/sessions`,
        sessionsResponseSchema,
        {
          signal,
          query: {
            pageSize: GLOBAL_PAGE_SIZE,
            sortBy: "sessionDate",
            sortDirection: "asc",
          },
        },
      ),
  });
}

export function useRoundResults(params: {
  roundId: string;
  category: string;
  sessionType: string;
  page: number;
  timeView: "sectors" | "splits";
  sortBy: "finalTime" | `time:${number}`;
  sortDirection: "asc" | "desc";
}, enabled = true) {
  return useQuery({
    queryKey: roundQueryKeys.results(params.roundId, params),
    queryFn: ({ signal }) =>
      apiClient.get(
        `/api/v1/rounds/${encodeURIComponent(params.roundId)}/results`,
        sessionResultsSchema,
        {
          signal,
          query: {
            category: params.category,
            sessionType: params.sessionType,
            timeView: params.timeView,
            sortBy: params.sortBy,
            sortDirection: params.sortDirection,
            page: params.page,
            pageSize: GLOBAL_PAGE_SIZE,
          },
        },
      ),
    enabled:
      enabled &&
      params.roundId.length > 0 &&
      params.category.length > 0 &&
      params.sessionType.length > 0,
    placeholderData: keepPreviousData,
  });
}
export type RoundSessionsWireContract = AssertApiContract<ApiSchema<'PublicPagedResponseOfCommonSessionDto'> extends z.input<typeof sessionsResponseSchema> ? true : false>
