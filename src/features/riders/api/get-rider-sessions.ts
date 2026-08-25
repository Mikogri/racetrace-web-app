import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import {
  entityIdSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from "../../../lib/validation";
import type { MetricsFilters } from "../../../types/domain";
import { normalizeCategoryValue } from "../../../utils/categories";
import { riderQueryKeys } from "./rider-query-keys";

export type RiderSessionKind =
  | "seeding"
  | "qualifying"
  | "qualifying_1"
  | "qualifying_2"
  | "semi_final"
  | "final"
  | "other";

export type RiderSessionResult = {
  resultId: string;
  sessionId: string;
  roundId: string;
  roundNumber: number | null;
  season: number | null;
  trackId: string | null;
  trackName: string | null;
  venueName: string | null;
  countryCode: string | null;
  date: string | null;
  conditionId: string | null;
  conditionName: string | null;
  competitionClassId: string | null;
  competitionClassCode: string | null;
  competitionClassName: string | null;
  category: string | null;
  kind: RiderSessionKind;
  sessionType: string;
  abbreviation: string;
  sessionOrder: number;
  isFinal: boolean;
  position: number | null;
  status: string;
  isClassified: boolean;
  isStart: boolean;
  topSpeed: number | null;
  awardedPoints: number;
};

const relatedSchema = z
  .object({
    id: entityIdSchema.optional(),
    code: nullableStringSchema,
    name: nullableStringSchema,
    venue: nullableStringSchema,
    country_code: nullableStringSchema,
  })
  .passthrough()
  .nullish();

const roundSchema = z
  .object({
    id: entityIdSchema.optional(),
    round_number: z.number().int().nullish(),
    season_year: z.number().int().nullish(),
    start_date: nullableStringSchema,
    track_id: entityIdSchema.nullish(),
    condition_id: entityIdSchema.nullish(),
    competition_class_id: entityIdSchema.nullish(),
    tracks: relatedSchema,
    conditions: relatedSchema,
    competition_class: relatedSchema,
    competition_levels: relatedSchema,
  })
  .passthrough()
  .nullish();

const roundCategorySchema = z
  .object({
    rounds: roundSchema,
    categories: relatedSchema,
  })
  .passthrough()
  .nullish();

const sessionSchema = z
  .object({
    id: entityIdSchema.optional(),
    name: nullableStringSchema,
    session_type: nullableStringSchema,
    session_date: nullableStringSchema,
    rounds: roundSchema,
    round_categories: roundCategorySchema,
    categories: relatedSchema,
    conditions: relatedSchema,
  })
  .passthrough()
  .nullish();

const resultRawSchema = z
  .object({
    id: entityIdSchema.optional(),
    position: z.number().int().nullish(),
    status: nullableStringSchema,
    is_classified: z.boolean().nullish(),
    top_speed: nullableNumberSchema,
    awarded_points: z.number().nullish(),
    sessions: sessionSchema,
  })
  .passthrough()
  .transform((value): RiderSessionResult | null => {
    const session = value.sessions;
    const round = session?.rounds ?? session?.round_categories?.rounds;
    const resultId = value.id;
    const sessionId = session?.id;
    const roundId = round?.id;
    if (!resultId || !sessionId || !roundId) return null;

    const kind = normalizeSessionKind(session.session_type ?? session.name);
    const status = normalizeStatus(value.status);
    const position = value.position ?? null;
    const category = session.categories ?? session.round_categories?.categories;
    const condition = session.conditions ?? round.conditions;
    const competitionClass =
      round.competition_class ?? round.competition_levels;

    return {
      resultId,
      sessionId,
      roundId,
      roundNumber: round.round_number ?? null,
      season: round.season_year ?? null,
      trackId: round.track_id ?? round.tracks?.id ?? null,
      trackName: round.tracks?.name ?? null,
      venueName: round.tracks?.venue ?? round.tracks?.name ?? null,
      countryCode: round.tracks?.country_code ?? null,
      date: session.session_date ?? round.start_date ?? null,
      conditionId: round.condition_id ?? condition?.id ?? null,
      conditionName: condition?.name ?? null,
      competitionClassId:
        round.competition_class_id ?? competitionClass?.id ?? null,
      competitionClassCode: competitionClass?.code ?? null,
      competitionClassName: competitionClass?.name ?? null,
      category: publicCategoryCode(category?.code),
      kind,
      sessionType: session.session_type ?? session.name ?? "Other",
      abbreviation: sessionAbbreviation(kind),
      sessionOrder: sessionOrder(kind),
      isFinal: kind === "final",
      position,
      status,
      isClassified:
        value.is_classified === true &&
        position !== null &&
        position > 0 &&
        !["DNS", "DNF", "DSQ", "DNQ", "CANCELLED", "MISSING"].includes(status),
      isStart: !["DNS", "CANCELLED", "MISSING"].includes(status),
      topSpeed: value.top_speed,
      awardedPoints: value.awarded_points ?? 0,
    };
  });

export type RiderSessionCollection = RiderSessionResult[] & {
  riderGender?: string | null;
};

export const riderSessionsSchema = z
  .object({
    results: z.array(resultRawSchema).optional(),
    gender: nullableStringSchema.optional(),
    sex: nullableStringSchema.optional(),
  })
  .passthrough()
  .transform((value) => {
    const results = (value.results ?? [])
      .filter((result): result is RiderSessionResult => result !== null)
      .sort(compareSessions) as RiderSessionCollection;
    Object.defineProperty(results, "riderGender", {
      value: value.gender ?? value.sex ?? null,
      enumerable: false,
    });
    return results;
  });

export const riderSessionResultsSchema = z
  .array(resultRawSchema)
  .transform((value) =>
    value
      .filter((result): result is RiderSessionResult => result !== null)
      .sort(compareSessions),
  );

export function getRiderSessionGender(
  results: RiderSessionCollection | undefined,
) {
  return results?.riderGender ?? null;
}

export function normalizeSessionKind(
  value: string | null | undefined,
): RiderSessionKind {
  const normalized = value?.replace(/[^a-z0-9]/gi, "").toUpperCase() ?? "";
  if (["S", "SEEDING", "SEEDINGRUN", "SEEDINGROUND"].includes(normalized))
    return "seeding";
  if (["Q", "QUALI", "QUALIFYING", "QUALIFICATION"].includes(normalized))
    return "qualifying";
  if (["Q1", "QUALI1", "QUALIFYING1", "QUALIFICATION1"].includes(normalized))
    return "qualifying_1";
  if (["Q2", "QUALI2", "QUALIFYING2", "QUALIFICATION2"].includes(normalized))
    return "qualifying_2";
  if (["SF", "SEMI", "SEMIFINAL", "SEMIFINALS"].includes(normalized))
    return "semi_final";
  if (["F", "FINAL", "FINALS", "FINALRUN"].includes(normalized)) return "final";
  return "other";
}

function sessionAbbreviation(kind: RiderSessionKind) {
  return {
    seeding: "S",
    qualifying: "Q",
    qualifying_1: "Q1",
    qualifying_2: "Q2",
    semi_final: "SF",
    final: "F",
    other: "O",
  }[kind];
}

function sessionOrder(kind: RiderSessionKind) {
  return {
    seeding: 1,
    qualifying: 2,
    qualifying_1: 3,
    qualifying_2: 4,
    semi_final: 5,
    final: 6,
    other: 50,
  }[kind];
}

function normalizeStatus(value: string | null | undefined) {
  const normalized = value?.replace(/[^a-z0-9]/gi, "").toUpperCase() ?? "";
  if (["FINISHED", "CLASSIFIED"].includes(normalized)) return "FINISHED";
  if (["DNS", "DIDNOTSTART"].includes(normalized)) return "DNS";
  if (["DNF", "DIDNOTFINISH"].includes(normalized)) return "DNF";
  if (["DSQ", "DISQUALIFIED"].includes(normalized)) return "DSQ";
  if (["DNQ", "NOTQUALIFIED"].includes(normalized)) return "DNQ";
  if (["CANCELLED", "CANCELED"].includes(normalized)) return "CANCELLED";
  if (normalized === "ONTRACK") return "ON TRACK";
  if (normalized === "STARTED") return "STARTED";
  return value?.trim().toUpperCase() || "MISSING";
}

function publicCategoryCode(value: string | null | undefined) {
  return normalizeCategoryValue(value);
}

function compareSessions(left: RiderSessionResult, right: RiderSessionResult) {
  return (
    (left.date ?? "").localeCompare(right.date ?? "") ||
    (left.roundNumber ?? 0) - (right.roundNumber ?? 0) ||
    left.sessionOrder - right.sessionOrder ||
    left.sessionId.localeCompare(right.sessionId, undefined, { numeric: true })
  );
}

export function filterRiderSessions(
  results: RiderSessionResult[],
  filters: MetricsFilters,
) {
  return results.filter(
    (result) =>
      (filters.seasons.length === 0 ||
        (result.season !== null &&
          filters.seasons.includes(String(result.season)))) &&
      (filters.tracks.length === 0 ||
        (result.trackId !== null && filters.tracks.includes(result.trackId))) &&
      (filters.conditions.length === 0 ||
        (result.conditionId !== null &&
          filters.conditions.includes(result.conditionId))) &&
      (filters.classes.length === 0 ||
        (result.competitionClassId !== null &&
          filters.classes.includes(result.competitionClassId))) &&
      (filters.categories.length === 0 ||
        (result.category !== null &&
          filters.categories.includes(result.category))),
  );
}

export function useRiderSessions(riderId: string) {
  return useQuery({
    queryKey: riderQueryKeys.sessions(riderId),
    queryFn: ({ signal }) =>
      apiClient.get(
        `/api/v1/riders/${encodeURIComponent(riderId)}`,
        riderSessionsSchema,
        {
          signal,
          query: { include: "results" },
        },
      ),
  });
}
