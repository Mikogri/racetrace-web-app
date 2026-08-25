import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { ApiError } from "../../../types/api";
import { GLOBAL_PAGE_SIZE } from "../../../config/pagination";
import {
  entityIdSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from "../../../lib/validation";
import { liveQueryKeys } from "./live-query-keys";
import { roundListItemSchema } from "../../results/api/get-rounds";
import { normalizeCategoryValue } from "../../../utils/categories";

const liveRoundsResponseSchema = z.object({
  items: z.array(roundListItemSchema),
});

const liveRoundContextSchema = z.object({
  context_name: z.string().nullish(),
});

const resolvedRidersSchema = z.object({
  items: z.array(z.object({
    riderId: entityIdSchema,
    uciId: z.string(),
  })),
});

const nestedSchema = z
  .object({
    code: z.string().nullish(),
    name: z.string().nullish(),
    venue: z.string().nullish(),
    country_code: z.string().nullish(),
  })
  .passthrough()
  .nullish();

export const liveSessionRawSchema = z
  .object({
    id: entityIdSchema.optional(),
    sessionId: entityIdSchema.optional(),
    round_id: entityIdSchema.optional(),
    name: z.string().nullish(),
    session_type: z.string().nullish(),
    sessionType: z.string().nullish(),
    category: z.string().nullish(),
    categories: nestedSchema,
    status: z.string().nullish(),
    session_date: z.string().nullish(),
    sessionDate: z.string().nullish(),
    riderIds: z.array(entityIdSchema).optional(),
    chronorace_url: z.string().url().nullish(),
    chronoraceUrl: z.string().url().nullish(),
    rounds: z
      .object({
        id: entityIdSchema.optional(),
        round_number: z.number().int().nullish(),
        season_year: z.number().int().nullish(),
        context_name: z.string().nullish(),
        competition_levels: nestedSchema,
        tracks: nestedSchema,
      })
      .passthrough()
      .nullish(),
  })
  .passthrough()
  .transform((value) => ({
    id: value.sessionId ?? value.id ?? "",
    name: value.name ?? value.sessionType ?? value.session_type ?? "Session",
    sessionType: value.sessionType ?? value.session_type ?? null,
    category: value.category ?? value.categories?.code ?? null,
    status: value.status ?? "unknown",
    date: value.sessionDate ?? value.session_date ?? null,
    roundId: value.rounds?.id ?? value.round_id ?? null,
    roundNumber: value.rounds?.round_number ?? null,
    venue: value.rounds?.tracks?.venue ?? value.rounds?.tracks?.name ?? null,
    countryCode: value.rounds?.tracks?.country_code ?? null,
    season: value.rounds?.season_year ?? null,
    contextName: value.rounds?.context_name ?? null,
    competitionName: value.rounds?.competition_levels?.name ?? null,
    riderCount: value.riderIds?.length ?? null,
    chronoraceUrl: value.chronoraceUrl ?? value.chronorace_url ?? null,
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

type ChronoCatalogNode = {
  Id: string | undefined;
  Name: string | undefined;
  DisplayName: string | undefined;
  Route: string | undefined;
  Childs: ChronoCatalogNode[];
};

const LIVE_REFRESH_INTERVAL = 3_000;
const ACTIVE_ROUND_STATUSES = new Set(["live", "active", "running"]);

export function isLiveRoundStatus(status: string | null | undefined) {
  return ACTIVE_ROUND_STATUSES.has(status?.trim().toLowerCase() ?? "");
}

function chronoHasNextToStart(root: Record<string, unknown>) {
  const nextToStart = root.NextToStart;
  return Array.isArray(nextToStart)
    ? nextToStart.length > 0
    : asRecord(nextToStart) !== null ||
      (nextToStart !== null && nextToStart !== undefined);
}

function activeChronoOnTrack(root: Record<string, unknown>) {
  const candidates = (Array.isArray(root.OnTrack) ? root.OnTrack : [])
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => item !== null);
  if (chronoHasNextToStart(root)) return candidates;

  // ChronoRace can retain stale InRace rows after a session closes. During an
  // active run at least one of these live-order markers is populated.
  return candidates.filter((item) =>
    [item.ExpectedStartTime, item.SortOrder, item.StatusTime]
      .some((value) => (numberValue(value) ?? 0) > 0),
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function identifierValue(value: unknown) {
  return stringValue(value) ??
    (typeof value === "number" && Number.isFinite(value) ? String(value) : null);
}

function catalogNode(value: unknown): ChronoCatalogNode | null {
  const record = asRecord(value);
  if (!record) return null;
  return {
    Id: stringValue(record.Id) ?? undefined,
    Name: stringValue(record.Name) ?? undefined,
    DisplayName: stringValue(record.DisplayName) ?? undefined,
    Route: stringValue(record.Route) ?? undefined,
    Childs: Array.isArray(record.Childs)
      ? record.Childs.flatMap((child) => {
          const parsed = catalogNode(child);
          return parsed ? [parsed] : [];
        })
      : [],
  };
}

function chronoRouteKey(route: string | undefined) {
  if (!route) return null;
  try {
    const parsed = JSON.parse(route) as unknown;
    const params = asRecord(asRecord(parsed)?.Params);
    return identifierValue(params?.key);
  } catch {
    return null;
  }
}

export function discoverChronoRaceSessions(
  payload: unknown,
  round: LiveRound,
): LiveSession[] {
  const root = catalogNode(payload);
  const discipline = root?.Childs?.find(
    (node) => node.Name?.toLowerCase() === "dhi",
  );
  if (!discipline || !round.contextName) return [];
  const contextName = round.contextName;

  return (discipline.Childs ?? []).flatMap((category) => {
    const categoryValue =
      normalizeCategoryValue(category.Name ?? category.DisplayName) ??
      category.Name ??
      "unknown";
    return (category.Childs ?? []).flatMap((sessionGroup) => {
      const liveRoute = (sessionGroup.Childs ?? []).find((node) =>
        Boolean(chronoRouteKey(node.Route)),
      );
      const key = chronoRouteKey(liveRoute?.Route);
      if (!key) return [];
      return [
        {
          id: key,
          name: sessionGroup.DisplayName ?? sessionGroup.Name ?? "Session",
          sessionType: sessionGroup.Name ?? null,
          category: categoryValue,
          status: "scheduled",
          date: round.startDate,
          roundId: round.roundId,
          roundNumber: round.roundNumber,
          venue: round.venueName,
          countryCode: round.countryCode,
          season: round.season,
          contextName,
          competitionName: round.competitionClassName,
          riderCount: null,
          chronoraceUrl: `/api/v1/live/chronorace/results/${encodeURIComponent(contextName)}/${encodeURIComponent(key)}`,
        },
      ];
    });
  });
}

export function resolveChronoRaceSessionStatus(payload: unknown) {
  const root = asRecord(payload);
  if (!root) return "scheduled";
  if (activeChronoOnTrack(root).length > 0 || chronoHasNextToStart(root)) {
    return "live";
  }
  const results = Array.isArray(root.Results) ? root.Results.length : 0;
  return results > 0 ? "completed" : "scheduled";
}

function displayCase(value: string | null) {
  if (!value || value !== value.toUpperCase()) return value;
  return value
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

function chronoMilliseconds(value: unknown) {
  const parsed = numberValue(value);
  return parsed === null || parsed <= 0 ? null : parsed / 1_000;
}

export function resolveChronoRaceJsonUrl(source: string) {
  const url = new URL(source);
  const route = url.hash.replace(/^#/, "").split("?")[0];
  const segments = route.split("/").filter(Boolean);
  const eventIndex = segments.findIndex(
    (segment) => segment.toLowerCase() === "event",
  );
  const knownDisciplines = new Set([
    "dh",
    "bmx",
    "bmxfs",
    "edr",
    "track",
    "trials",
    "xco",
    "xcc",
  ]);
  const disciplineIndex = segments.findIndex(
    (segment, index) =>
      index > eventIndex + 1 && knownDisciplines.has(segment.toLowerCase()),
  );
  if (
    eventIndex >= 0 &&
    disciplineIndex > eventIndex &&
    segments.length > disciplineIndex + 1
  ) {
    const context = segments[eventIndex + 1];
    const discipline = segments[disciplineIndex].toLowerCase();
    const key = segments[disciplineIndex + 1];
    return `https://prod.chronorace.be/api/results/generic/uci/${encodeURIComponent(context)}/${encodeURIComponent(discipline)}?key=${encodeURIComponent(key)}`;
  }
  return url.toString();
}

type DirectTiming = {
  index: number;
  name: string;
  time: number;
};

type DirectResult = {
  key: string;
  position: number | null;
  uciId: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  countryCode: string | null;
  teamName: string | null;
  status: string | null;
  isOnTrack: boolean;
  finalTime: number | null;
  times: DirectTiming[];
};

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

function chronoRiderMap(root: Record<string, unknown>) {
  const riders = asRecord(root.Riders) ?? {};
  return new Map(
    Object.entries(riders).flatMap(([technicalKey, rawRider]) => {
      const rider = asRecord(rawRider);
      if (!rider) return [];
      return [...new Set([technicalKey, identifierValue(rider.RaceNr)].filter((key): key is string => Boolean(key)))]
        .map((key) => [key, rider] as const);
    }),
  );
}

function timingEntries(value: unknown) {
  const result = asRecord(value);
  return (Array.isArray(result?.Times) ? result.Times : []).flatMap(
    (rawTiming, index) => {
      const timing = asRecord(rawTiming);
      const time = chronoMilliseconds(timing?.RaceTime);
      const position = numberValue(timing?.Position);
      return timing && time !== null && position !== null && position > 0
        ? [{ split: index + 1, time, position: Math.trunc(position) }]
        : [];
    },
  );
}

export function liveTimingPresentation(payload: unknown): {
  riders: LiveCourseRider[];
  summary: LiveTimingSummary;
} {
  const root = asRecord(payload) ?? {};
  const allResults = (Array.isArray(root.Results) ? root.Results : [])
    .map(asRecord)
    .filter((result): result is Record<string, unknown> => result !== null);
  const onTrack = activeChronoOnTrack(root);
  const onTrackRaceNumbers = new Set(
    onTrack.flatMap((result) => {
      const raceNumber = identifierValue(result.RaceNr) ?? identifierValue(result.Key);
      return raceNumber ? [raceNumber] : [];
    }),
  );
  const leader = allResults.find((result) => numberValue(result.Position) === 1)
    ?? [...allResults]
      .filter((result) => chronoMilliseconds(result.RaceTime) !== null)
      .sort((left, right) =>
        (chronoMilliseconds(left.RaceTime) ?? Number.POSITIVE_INFINITY) -
        (chronoMilliseconds(right.RaceTime) ?? Number.POSITIVE_INFINITY),
      )[0];
  const podium = [...allResults]
    .filter((result) => {
      const position = numberValue(result.Position);
      return position !== null && position >= 1 && position <= 3;
    })
    .sort((left, right) =>
      (numberValue(left.Position) ?? Number.POSITIVE_INFINITY) -
      (numberValue(right.Position) ?? Number.POSITIVE_INFINITY),
    );
  const selectedSource = onTrack.length > 0
    ? [leader, ...onTrack]
    : podium;
  const selected = selectedSource
    .filter((result): result is Record<string, unknown> => Boolean(result))
    .filter((result, index, items) =>
      items.findIndex((candidate) => identifierValue(candidate.RaceNr) === identifierValue(result.RaceNr)) === index,
    );
  // ChronoRace exposes four intermediate splits; the final result is a fifth,
  // separate course step.
  const splitCount = 4;
  const riders = chronoRiderMap(root);
  const leaderAtSplit = new Map(
    leader ? timingEntries(leader).map((timing) => [timing.split, timing.time] as const) : [],
  );
  const leaderFinish = chronoMilliseconds(leader?.RaceTime);
  const finishGap = (result: Record<string, unknown> | undefined) => {
    if (!result || leaderFinish === null) return null;
    if (numberValue(result.Position) === 1) return 0;
    const explicitGap = chronoMilliseconds(
      result.Gap ?? result.TimeGap ?? result.TimeBehind ?? result.Difference,
    );
    if (explicitGap !== null) return explicitGap;
    const raceTime = chronoMilliseconds(result.RaceTime);
    if (raceTime === null) return null;
    // ChronoRace mixes absolute winning times with relative gaps in some feeds.
    // A value far below the winning run duration is already a gap.
    return raceTime < leaderFinish * 0.5 ? raceTime : raceTime - leaderFinish;
  };
  const officialResults = new Map(
    allResults.flatMap((result) => {
      const raceNumber = identifierValue(result.RaceNr);
      return raceNumber ? [[raceNumber, result] as const] : [];
    }),
  );
  const leaderRaceNumber = leader ? identifierValue(leader.RaceNr) : null;

  const courseRiders = selected.flatMap((result): LiveCourseRider[] => {
    const raceNumber = identifierValue(result.RaceNr);
    if (!raceNumber) return [];
    const rider = riders.get(raceNumber) ?? {};
    const timings = timingEntries(result);
    const officialResult = officialResults.get(raceNumber);
    const isCurrentlyOnTrack = onTrackRaceNumbers.has(raceNumber);
    const rawFinish = isCurrentlyOnTrack
      ? null
      : chronoMilliseconds(officialResult?.RaceTime);
    const rawPosition = numberValue(officialResult?.Position ?? result.Position);
    const finishPosition = rawPosition !== null && rawPosition > 0
      ? Math.trunc(rawPosition)
      : null;
    const lastPosition = isCurrentlyOnTrack
      ? (timings.at(-1)?.position ?? null)
      : (finishPosition ?? timings.at(-1)?.position ?? null);
    if (lastPosition === null) return [];
    const lastTiming = timings.at(-1);
    const officialFinishGap = finishGap(officialResult);
    const gap = rawFinish !== null && officialFinishGap !== null
      ? officialFinishGap
      : lastTiming
        ? lastTiming.time - (leaderAtSplit.get(lastTiming.split) ?? lastTiming.time)
        : null;
    const splitPoints = timings
      .filter((timing) => timing.split <= splitCount)
      .map((timing) => ({
        split: timing.split,
        gap: timing.time - (leaderAtSplit.get(timing.split) ?? timing.time),
      }));
    const points = rawFinish !== null
      ? [...splitPoints, { split: splitCount + 1, gap: officialFinishGap ?? 0 }]
      : splitPoints;
    const firstName = displayCase(stringValue(rider.GivenName) ?? stringValue(rider.FirstName));
    const lastName = displayCase(stringValue(rider.FamilyName) ?? stringValue(rider.LastName));
    return [{
      key: raceNumber,
      uciId: identifierValue(rider.UciRiderId),
      fullName: [firstName, lastName].filter(Boolean).join(" ") || `Rider ${raceNumber}`,
      teamName: displayCase(stringValue(rider.UciTeamName)),
      position: lastPosition,
      isLeader: raceNumber === leaderRaceNumber,
      gap: points.at(-1)?.gap ?? gap,
      points,
    }];
  });

  return {
    riders: courseRiders,
    summary: {
      finished: allResults.filter((result) => chronoMilliseconds(result.RaceTime) !== null).length,
      onTrack: onTrack.length,
      toStart: Array.isArray(root.NextToStart) ? root.NextToStart.length : 0,
      splitCount,
    },
  };
}

export function normalizeChronoRacePayload(
  payload: unknown,
  session: LiveSession,
): SessionResults {
  const root = asRecord(payload);
  if (!root)
    throw new ApiError("ChronoRace returned an unsupported response.", {
      code: "validation",
    });

  const riders = asRecord(root.Riders) ?? {};
  const ridersByRaceNumber = chronoRiderMap(root);
  const onTrackRaceNumbers = new Set(
    activeChronoOnTrack(root).flatMap((result) => {
      const raceNumber = identifierValue(result?.RaceNr) ?? identifierValue(result?.Key);
      return raceNumber ? [raceNumber] : [];
    }),
  );
  const rawResults = Array.isArray(root.Results) ? root.Results : [];
  const directResults: DirectResult[] = rawResults.flatMap((raw, rowIndex) => {
    const result = asRecord(raw);
    if (!result) return [];
    const raceNumber =
      identifierValue(result.RaceNr) ??
      identifierValue(result.Key) ??
      String(rowIndex + 1);
    const rider = ridersByRaceNumber.get(raceNumber) ?? asRecord(riders[raceNumber]) ?? {};
    const firstName = displayCase(
      stringValue(rider.GivenName) ?? stringValue(rider.FirstName),
    );
    const lastName = displayCase(
      stringValue(rider.FamilyName) ?? stringValue(rider.LastName),
    );
    const fallbackName =
      displayCase(stringValue(rider.Name)) ?? `Rider ${raceNumber}`;
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || fallbackName;
    const isOnTrack = onTrackRaceNumbers.has(raceNumber);
    const finalTime = isOnTrack ? null : chronoMilliseconds(result.RaceTime);
    const rawTimes = Array.isArray(result.Times) ? result.Times : [];
    const cumulativeTimes = rawTimes.flatMap((rawTime, index) => {
      const timing = asRecord(rawTime);
      const time = timing ? chronoMilliseconds(timing.RaceTime) : null;
      return time === null ? [] : [{ index: index + 1, time }];
    });
    let previous = 0;
    const times: DirectTiming[] = cumulativeTimes.flatMap((timing) => {
      const sectorTime = timing.time - previous;
      previous = timing.time;
      return sectorTime >= 0
        ? [{ index: timing.index, name: `Sector ${timing.index}`, time: sectorTime }]
        : [];
    });
    if (!isOnTrack && finalTime !== null && finalTime > previous) {
      const index = times.length + 1;
      times.push({ index, name: `Sector ${index}`, time: finalTime - previous });
    }
    const rawPosition = numberValue(result.Position);
    const status = isOnTrack ? "On Track" : stringValue(result.Status);
    return [
      {
        key: raceNumber,
        position: rawPosition && rawPosition > 0 ? Math.trunc(rawPosition) : null,
        uciId: identifierValue(rider.UciRiderId),
        firstName,
        lastName,
        fullName,
        countryCode: stringValue(rider.Nation) ?? stringValue(rider.UciCode)?.slice(0, 3) ?? null,
        teamName: displayCase(stringValue(rider.UciTeamName)),
        status,
        isOnTrack,
        finalTime,
        times,
      },
    ];
  });

  const validResults = directResults.filter(
    (result) => result.finalTime !== null && !["DNS", "DNF", "DSQ"].includes(result.status?.toUpperCase() ?? ""),
  );
  const bestFinal = validResults.length
    ? Math.min(...validResults.map((result) => result.finalTime!))
    : null;
  const timingIndexes = [
    ...new Set(directResults.flatMap((result) => result.times.map((time) => time.index))),
  ].sort((left, right) => left - right);
  const bestByIndex = new Map(
    timingIndexes.map((index) => {
      const values = directResults
        .map((result) => result.times.find((time) => time.index === index)?.time)
        .filter((time): time is number => time !== undefined);
      return [index, values.length ? Math.min(...values) : null] as const;
    }),
  );
  const positionByIndex = new Map<number, Map<string, number>>();
  for (const index of timingIndexes) {
    const ordered = directResults
      .flatMap((result) => {
        const time = result.times.find((entry) => entry.index === index)?.time;
        return time === undefined ? [] : [{ key: result.key, time }];
      })
      .sort((left, right) => left.time - right.time);
    positionByIndex.set(
      index,
      new Map(ordered.map((entry, position) => [entry.key, position + 1])),
    );
  }

  const items: SessionResults["items"] = directResults
    .sort((left, right) => (left.position ?? Number.MAX_SAFE_INTEGER) - (right.position ?? Number.MAX_SAFE_INTEGER))
    .map((result) => ({
      position: result.position,
      resultId: `chrono-${session.id}-${result.key}`,
      riderId: null,
      uciId: result.uciId,
      firstName: result.firstName,
      lastName: result.lastName,
      fullName: result.fullName,
      countryCode: result.countryCode,
      teamId: null,
      teamName: result.teamName,
      status: result.status,
      topSpeed: null,
      averageSpeed: null,
      finalTime: result.finalTime,
      finalGapToBest:
        result.finalTime !== null && bestFinal !== null
          ? result.finalTime - bestFinal
          : null,
      awardedPoints: 0,
      times: result.times.map((time) => ({
        ...time,
        gapToBest:
          bestByIndex.get(time.index) === null
            ? null
            : time.time - (bestByIndex.get(time.index) ?? time.time),
        position: positionByIndex.get(time.index)?.get(result.key) ?? null,
      })),
      isPerfectRun: false,
    }));

  const perfectTimes = timingIndexes.flatMap((index) => {
    const time = bestByIndex.get(index);
    return time === null || time === undefined
      ? []
      : [{ index, name: `Sector ${index}`, time, gapToBest: 0, position: null }];
  });
  const perfectFinal = perfectTimes.length
    ? perfectTimes.reduce((sum, timing) => sum + timing.time, 0)
    : null;
  if (perfectTimes.length) {
    items.unshift({
      position: null,
      resultId: null,
      riderId: null,
      uciId: null,
      firstName: null,
      lastName: null,
      fullName: "Perfect Run",
      countryCode: null,
      teamId: null,
      teamName: null,
      status: null,
      topSpeed: null,
      averageSpeed: null,
      finalTime: perfectFinal,
      finalGapToBest:
        perfectFinal !== null && bestFinal !== null ? perfectFinal - bestFinal : null,
      awardedPoints: 0,
      times: perfectTimes,
      isPerfectRun: true,
    });
  }

  return sessionResultsSchema.parse({
    session: {
      sessionId: session.id,
      roundId: session.roundId ?? "0",
      sessionType: session.sessionType,
      category: session.category,
      condition: null,
      completedRidersCount: validResults.length,
      startedRidersCount: directResults.length,
      splitCount: timingIndexes.length,
      sectorCount: timingIndexes.length,
      timeView: "sectors",
    },
    items,
    page: 1,
    pageSize: Math.max(1, items.length),
    totalItems: directResults.length,
    totalPages: items.length ? 1 : 0,
  });
}

export function useLiveRound(params: {
  season: number;
  roundId?: string | null;
}) {
  return useQuery({
    queryKey: liveQueryKeys.rounds(params),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(
        "/api/v1/rounds",
        liveRoundsResponseSchema,
        {
          signal,
          query: {
            season: params.season,
            sortBy: "roundNumber",
            sortDirection: "asc",
            page: 1,
            pageSize: GLOBAL_PAGE_SIZE,
          },
        },
      );
      const activeRounds = response.items.filter((round) =>
        isLiveRoundStatus(round.status),
      );
      const selected = params.roundId
        ? activeRounds.find((round) => round.roundId === params.roundId) ?? null
        : activeRounds[0] ?? null;
      if (!selected) return null;
      if (selected.contextName) return selected;
      const detail = await apiClient.get(
        `/api/v1/rounds/${encodeURIComponent(selected.roundId)}`,
        liveRoundContextSchema,
        { signal },
      );
      return { ...selected, contextName: detail.context_name ?? null };
    },
    refetchInterval: LIVE_REFRESH_INTERVAL,
  });
}

export function useChronoRaceCatalog(round: LiveRound | null | undefined) {
  const context = round?.contextName ?? "";
  return useQuery({
    queryKey: liveQueryKeys.catalog(context),
    enabled: context.length > 0,
    queryFn: ({ signal }) =>
      apiClient.get(
        `/api/v1/live/chronorace/catalog/${encodeURIComponent(context)}`,
        z.unknown(),
        { signal },
      ),
    select: (payload) => (round ? discoverChronoRaceSessions(payload, round) : []),
    refetchInterval: LIVE_REFRESH_INTERVAL,
  });
}

export function useResolvedLiveRiderIds(uciIds: string[]) {
  const uniqueIds = [...new Set(uciIds.filter(Boolean))].sort();
  return useQuery({
    queryKey: liveQueryKeys.riderIds(uniqueIds),
    enabled: uniqueIds.length > 0,
    queryFn: ({ signal }) =>
      apiClient.get("/api/v1/riders/resolve", resolvedRidersSchema, {
        signal,
        query: { uciIds: uniqueIds.join(",") },
      }),
    select: (data) => new Map(data.items.map((item) => [item.uciId, item.riderId])),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useChronoRaceSessionSnapshot(session: LiveSession | undefined) {
  const context = session?.contextName ?? "";
  const key = session?.id ?? "";
  return useQuery({
    queryKey: liveQueryKeys.chronoResults(context, key),
    enabled: Boolean(session?.id && session.contextName),
    queryFn: async ({ signal }) => {
      if (!session || !context || !key)
        throw new ApiError("ChronoRace source is not configured for this session.", {
          code: "validation",
        });
      const payload = await apiClient.get(
        `/api/v1/live/chronorace/results/${encodeURIComponent(context)}/${encodeURIComponent(key)}`,
        z.unknown(),
        { signal },
      );
      const status = resolveChronoRaceSessionStatus(payload);
      const resultPayload = asRecord(payload) ?? { Riders: {}, Results: [] };
      const presentation = liveTimingPresentation(resultPayload);
      return {
        status,
        results: normalizeChronoRacePayload(resultPayload, { ...session, status }),
        ...presentation,
      };
    },
    refetchInterval: LIVE_REFRESH_INTERVAL,
  });
}


export function useChronoRaceSessionResults(session: LiveSession | undefined) {
  return useChronoRaceSessionSnapshot(session);
}
