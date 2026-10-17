import { z } from "zod";
import {
  entityIdSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from "../../../lib/validation";
import { normalizeCategoryValue } from "../../../utils/categories";
import { formatSessionLabel } from "../../../utils/domain-metadata";

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
    countryCode: nullableStringSchema,
  })
  .passthrough()
  .nullish();

const roundSchema = z
  .object({
    id: entityIdSchema.optional(),
    roundNumber: z.number().int().nullish(),
    seasonYear: z.number().int().nullish(),
    startDate: nullableStringSchema,
    trackId: entityIdSchema.nullish(),
    conditionId: entityIdSchema.nullish(),
    competitionClassId: entityIdSchema.nullish(),
    tracks: relatedSchema,
    conditions: relatedSchema,
    competitionClass: relatedSchema,
    competitionLevels: relatedSchema,
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
    sessionType: nullableStringSchema,
    sessionDate: nullableStringSchema,
    rounds: roundSchema,
    roundCategories: roundCategorySchema,
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
    isClassified: z.boolean().nullish(),
    topSpeed: nullableNumberSchema,
    awardedPoints: z.number().nullish(),
    sessions: sessionSchema,
  })
  .passthrough()
  .transform((value): RiderSessionResult | null => {
    const session = value.sessions;
    const round = session?.rounds ?? session?.roundCategories?.rounds;
    const resultId = value.id;
    const sessionId = session?.id;
    const roundId = round?.id;
    if (!resultId || !sessionId || !roundId) return null;

    const kind = normalizeSessionKind(session.sessionType ?? session.name);
    const status = normalizeStatus(value.status);
    const position = value.position ?? null;
    const category = session.categories ?? session.roundCategories?.categories;
    const condition = session.conditions ?? round.conditions;
    const competitionClass =
      round.competitionClass ?? round.competitionLevels;

    return {
      resultId,
      sessionId,
      roundId,
      roundNumber: round.roundNumber ?? null,
      season: round.seasonYear ?? null,
      trackId: round.trackId ?? round.tracks?.id ?? null,
      trackName: round.tracks?.name ?? null,
      venueName: round.tracks?.venue ?? round.tracks?.name ?? null,
      countryCode: round.tracks?.countryCode ?? null,
      date: session.sessionDate ?? round.startDate ?? null,
      conditionId: round.conditionId ?? condition?.id ?? null,
      conditionName: condition?.name ?? null,
      competitionClassId:
        round.competitionClassId ?? competitionClass?.id ?? null,
      competitionClassCode: competitionClass?.code ?? null,
      competitionClassName: competitionClass?.name ?? null,
      category: normalizeCategoryValue(category?.code),
      kind,
      sessionType: session.sessionType ?? session.name ?? "Other",
      abbreviation: formatSessionLabel(session.sessionType ?? session.name ?? "Other", "abbreviation"),
      sessionOrder: sessionOrder(kind),
      isFinal: kind === "final",
      position,
      status,
      isClassified:
        value.isClassified === true &&
        position !== null &&
        position > 0 &&
        !["DNS", "DNF", "DSQ", "DNQ", "CANCELLED", "MISSING"].includes(status),
      isStart: !["DNS", "CANCELLED", "MISSING"].includes(status),
      topSpeed: value.topSpeed,
      awardedPoints: value.awardedPoints ?? 0,
    };
  });

export const riderSessionResultsSchema = z
  .array(resultRawSchema)
  .transform((value) =>
    value
      .filter((result): result is RiderSessionResult => result !== null)
      .sort(compareSessions),
  );

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

function compareSessions(left: RiderSessionResult, right: RiderSessionResult) {
  return (
    (left.date ?? "").localeCompare(right.date ?? "") ||
    (left.roundNumber ?? 0) - (right.roundNumber ?? 0) ||
    left.sessionOrder - right.sessionOrder ||
    left.sessionId.localeCompare(right.sessionId, undefined, { numeric: true })
  );
}
