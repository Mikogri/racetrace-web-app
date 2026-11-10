import type { ApiSchema, AssertApiContract } from "../../../types/api-contract";
import { z } from "zod";
import {
  entityIdSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from "../../../lib/validation";
import { roundListItemSchema } from "../../results/api/get-rounds";

export const liveRoundsResponseSchema = z.object({
  items: z.array(roundListItemSchema),
});

export const liveRoundContextSchema = z.object({
  contextName: z.string().nullish(),
});

export const tissotCatalogSchema = z.object({
  provider: z.literal("tissot"),
  season: z.number().int(),
  competitionCode: z.string().nullish(),
  competitionName: z.string().nullish(),
  sessions: z.array(
    z.object({
      id: z.string(),
      provider: z.literal("tissot"),
      competitionCode: z.string(),
      eventNumber: z.number().int().positive(),
      phaseNumber: z.number().int().positive(),
      name: z.string(),
      sessionType: z.string().nullish(),
      category: z.string().nullish(),
      status: z.string(),
      sessionDate: z.string().nullish(),
      riderCount: z.number().int().nonnegative().nullish(),
    }),
  ),
});

export const resolvedRidersSchema = z.object({
  items: z.array(
    z.object({
      riderId: entityIdSchema,
      uciId: z.string(),
    }),
  ),
});

const nestedSchema = z
  .object({
    code: z.string().nullish(),
    name: z.string().nullish(),
    venue: z.string().nullish(),
    countryCode: z.string().nullish(),
  })
  .passthrough()
  .nullish();

export const liveSessionRawSchema = z
  .object({
    id: entityIdSchema.optional(),
    sessionId: entityIdSchema.optional(),
    roundId: entityIdSchema.optional(),
    name: z.string().nullish(),
    sessionType: z.string().nullish(),
    category: z.string().nullish(),
    categories: nestedSchema,
    status: z.string().nullish(),
    sessionDate: z.string().nullish(),
    riderIds: z.array(entityIdSchema).optional(),
    riderCount: z.number().int().nonnegative().nullish(),
    chronoraceUrl: z.string().url().nullish(),
    provider: z.enum(["chronorace", "tissot"]).optional(),
    competitionCode: z.string().nullish(),
    eventNumber: z.number().int().positive().nullish(),
    phaseNumber: z.number().int().positive().nullish(),
    rounds: z
      .object({
        id: entityIdSchema.optional(),
        roundNumber: z.number().int().nullish(),
        seasonYear: z.number().int().nullish(),
        contextName: z.string().nullish(),
        competitionLevels: nestedSchema,
        tracks: nestedSchema,
      })
      .passthrough()
      .nullish(),
  })
  .passthrough()
  .transform((value) => ({
    id: value.sessionId ?? value.id ?? "",
    name: value.name ?? value.sessionType ?? "Session",
    sessionType: value.sessionType ?? null,
    category: value.category ?? value.categories?.code ?? null,
    status: value.status ?? "unknown",
    date: value.sessionDate ?? null,
    roundId: value.rounds?.id ?? value.roundId ?? null,
    roundNumber: value.rounds?.roundNumber ?? null,
    venue: value.rounds?.tracks?.venue ?? value.rounds?.tracks?.name ?? null,
    countryCode: value.rounds?.tracks?.countryCode ?? null,
    season: value.rounds?.seasonYear ?? null,
    contextName: value.rounds?.contextName ?? null,
    competitionName: value.rounds?.competitionLevels?.name ?? null,
    riderCount: value.riderCount ?? value.riderIds?.length ?? null,
    chronoraceUrl: value.chronoraceUrl ?? null,
    provider: value.provider ?? "chronorace",
    competitionCode: value.competitionCode ?? null,
    eventNumber: value.eventNumber ?? null,
    phaseNumber: value.phaseNumber ?? null,
  }));

const resultTimeSchema = z
  .object({
    index: z.number().int(),
    name: z.string(),
    time: nullableNumberSchema,
    gapToBest: nullableNumberSchema.optional(),
    gapToLeader: nullableNumberSchema.optional(),
    position: z
      .number()
      .int()
      .nullish()
      .transform((value) => value ?? null),
  })
  .transform((value) => ({
    index: value.index,
    name: value.name,
    time: value.time,
    gapToBest: value.gapToBest ?? value.gapToLeader ?? null,
    position: value.position,
  }));

export const sessionResultSchema = z
  .object({
    position: z
      .number()
      .int()
      .nullish()
      .transform((value) => value ?? null),
    resultId: entityIdSchema.nullish().transform((value) => value ?? null),
    riderId: entityIdSchema.nullish().transform((value) => value ?? null),
    uciId: nullableStringSchema,
    firstName: nullableStringSchema,
    lastName: nullableStringSchema,
    fullName: z.string(),
    countryCode: nullableStringSchema,
    teamId: entityIdSchema.nullish().transform((value) => value ?? null),
    teamName: nullableStringSchema,
    status: nullableStringSchema,
    startTime: nullableStringSchema.optional(),
    sessionType: nullableStringSchema.optional(),
    liveStartedAt: z.number().optional(),
    topSpeed: nullableNumberSchema,
    averageSpeed: nullableNumberSchema,
    finalTime: nullableNumberSchema,
    finalGapToBest: nullableNumberSchema.optional(),
    finalGapToLeader: nullableNumberSchema.optional(),
    awardedPoints: z.number(),
    times: z.array(resultTimeSchema),
    isPerfectRun: z.boolean().optional().default(false),
  })
  .transform((value) => ({
    position: value.position,
    resultId: value.resultId,
    riderId: value.riderId,
    uciId: value.uciId,
    firstName: value.firstName,
    lastName: value.lastName,
    fullName: value.fullName,
    countryCode: value.countryCode,
    teamId: value.teamId,
    teamName: value.teamName,
    status: value.status,
    startTime: value.startTime,
    ...(value.sessionType ? { sessionType: value.sessionType } : {}),
    ...(value.liveStartedAt !== undefined
      ? { liveStartedAt: value.liveStartedAt }
      : {}),
    topSpeed: value.topSpeed,
    averageSpeed: value.averageSpeed,
    finalTime: value.finalTime,
    finalGapToBest: value.finalGapToBest ?? value.finalGapToLeader ?? null,
    awardedPoints: value.awardedPoints,
    times: value.times,
    isPerfectRun: value.isPerfectRun,
  }));

export const sessionSummarySchema = z.object({
  sessionId: entityIdSchema,
  roundId: entityIdSchema,
  sessionType: nullableStringSchema,
  category: nullableStringSchema,
  condition: z
    .object({
      id: entityIdSchema.nullish(),
      code: nullableStringSchema,
      name: nullableStringSchema,
    })
    .nullable(),
  completedRidersCount: z.number().int(),
  startedRidersCount: z.number().int(),
  splitCount: z.number().int(),
  sectorCount: z.number().int(),
  timeView: z.string(),
});

export const sessionResultsSchema = z
  .object({
    session: sessionSummarySchema,
    items: z.array(sessionResultSchema),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .transform((value) => ({
    ...value,
    items: [...value.items].sort(
      (left, right) => Number(right.isPerfectRun) - Number(left.isPerfectRun),
    ),
  }));

export type LiveSession = z.infer<typeof liveSessionRawSchema>;
export type LiveRound = z.infer<typeof roundListItemSchema>;
export type SessionResults = z.infer<typeof sessionResultsSchema>;

export type LiveCoursePoint = {
  split: number;
  gap: number;
};

export type LiveCourseRider = {
  key: string;
  uciId: string | null;
  fullName: string;
  teamName: string | null;
  position: number | null;
  isLeader: boolean;
  gap: number | null;
  points: LiveCoursePoint[];
};

export type LiveTimingSummary = {
  finished: number;
  onTrack: number;
  toStart: number;
  splitCount: number;
};

export type SessionResultsWireContract = AssertApiContract<
  ApiSchema<"SessionResultsResponseDto"> extends z.input<
    typeof sessionResultsSchema
  >
    ? true
    : false
>;
