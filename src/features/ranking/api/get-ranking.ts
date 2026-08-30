import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { GLOBAL_PAGE_SIZE } from "../../../config/pagination";
import {
  USE_SIMULATED_API_DATA,
  waitForSimulatedApi,
} from "../../../config/demo-data";
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
    .enum(["previousRound", "defaultFilters"])
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
  comparison?: "previousRound" | "defaultFilters";
};

const csv = (values: string[]) =>
  values.length > 0 ? values.join(",") : undefined;

const firstNames = [
  "Loic",
  "Jackson",
  "Finn",
  "Amaury",
  "Laurie",
  "Jordan",
  "Greg",
  "Benoit",
  "Danny",
  "Loris",
  "Matt",
  "Kade",
];
const lastNames = [
  "Bruni",
  "Goldstone",
  "Iles",
  "Pierron",
  "Greenland",
  "Williams",
  "Minnaar",
  "Coulanges",
  "Hart",
  "Vergier",
  "Walker",
  "Edwards",
  "Norton",
  "Meier-Smith",
  "Wilson",
  "Thirion",
];
const countries = [
  "FRA",
  "CAN",
  "GBR",
  "RSA",
  "USA",
  "AUS",
  "GER",
  "AUT",
  "NZL",
  "SUI",
];
const teams = [
  "Specialized Gravity",
  "Santa Cruz Syndicate",
  "Trek Factory Racing",
  "Canyon CLLCTV",
  "Commencal Muc-Off",
  "Norco Race Division",
];

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

async function getSimulatedRanking(
  params: RankingParams,
  signal: AbortSignal,
): Promise<RankingResponse> {
  await waitForSimulatedApi(signal, 1200);
  const season = Number(
    params.filters.seasons[0] ?? new Date().getUTCFullYear(),
  );
  const categoryOffset =
    ["elite_men", "elite_women", "junior_men", "junior_women"].indexOf(
      params.filters.categories[0] ?? "elite_men",
    ) * 1.7;
  const seasonOffset = (season % 5) * 0.8;
  const generated = Array.from({ length: 48 }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 5) % lastNames.length];
    const rating = clamp(
      98.6 - index * 1.05 - categoryOffset + seasonOffset,
      43,
      100,
    );
    return {
      position: index + 1,
      riderId: `demo-rider-${index + 1}`,
      uciId: null,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      countryCode: countries[index % countries.length],
      teamId: null,
      teamName: teams[index % teams.length],
      totalPoints: Math.max(
        45,
        Math.round(1510 - index * 29 + seasonOffset * 8),
      ),
      rating: Number(rating.toFixed(1)),
      pace: Number(clamp(rating + ((index % 5) - 2) * 1.4, 40, 100).toFixed(1)),
      consistency: Number(
        clamp(rating + ((index % 7) - 3) * 1.2, 40, 100).toFixed(1),
      ),
      confidence: Number(clamp(100 - index * 0.9, 52, 100).toFixed(1)),
      finalsCount: Math.max(1, 9 - Math.floor(index / 6)),
      qualifyingRate: clamp(1 - index * 0.0125, 0.35, 1),
      profileImageUrl: null,
    };
  });
  const search = params.search.trim().toLocaleLowerCase();
  const filtered = search
    ? generated.filter(
        (row) =>
          row.fullName.toLocaleLowerCase().includes(search) ||
          row.teamName.toLocaleLowerCase().includes(search),
      )
    : generated;
  const direction = params.sortDirection === "asc" ? 1 : -1;
  const sorted = [...filtered].sort((left, right) => {
    const leftValue = left[params.sortBy];
    const rightValue = right[params.sortBy];
    if (typeof leftValue === "string" && typeof rightValue === "string")
      return leftValue.localeCompare(rightValue) * direction;
    return (Number(leftValue ?? 0) - Number(rightValue ?? 0)) * direction;
  });
  const pageSize = params.pageSize ?? GLOBAL_PAGE_SIZE;
  const start = (params.page - 1) * pageSize;
  return rankingResponseSchema.parse({
    items: sorted.slice(start, start + pageSize),
    page: params.page,
    pageSize,
    totalItems: sorted.length,
    totalPages: Math.ceil(sorted.length / pageSize),
    summary: {
      sessionsCount: 24 + (season % 4),
      finalsCount: 9,
      ridersCount: sorted.length,
    },
  });
}

export function useRanking(params: RankingParams) {
  return useQuery({
    queryKey: rankingQueryKeys.list(params),
    placeholderData: keepPreviousData,
    structuralSharing: false,
    queryFn: ({ signal }) =>
      USE_SIMULATED_API_DATA
        ? getSimulatedRanking(params, signal)
        : apiClient.get("/api/v1/ranking", rankingResponseSchema, {
            signal,
            query: {
              season: csv(params.filters.seasons),
              trackId: csv(params.filters.tracks),
              conditionId: csv(params.filters.conditions),
              competitionClassId: csv(params.filters.classes),
              category: params.filters.categories[0] ?? "elite_men",
              search: params.search,
              page: params.page,
              pageSize: params.pageSize ?? GLOBAL_PAGE_SIZE,
              sortBy: params.sortBy,
              sortDirection: params.sortDirection,
              comparison: params.comparison,
            },
          }),
  });
}
