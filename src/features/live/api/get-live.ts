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

const tissotCatalogSchema = z.object({
  provider: z.literal("tissot"),
  season: z.number().int(),
  competitionCode: z.string().nullish(),
  competitionName: z.string().nullish(),
  sessions: z.array(z.object({
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
  })),
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
    riderCount: z.number().int().nonnegative().nullish(),
    chronorace_url: z.string().url().nullish(),
    chronoraceUrl: z.string().url().nullish(),
    provider: z.enum(["chronorace", "tissot"]).optional(),
    competitionCode: z.string().nullish(),
    eventNumber: z.number().int().positive().nullish(),
    phaseNumber: z.number().int().positive().nullish(),
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
    riderCount: value.riderCount ?? value.riderIds?.length ?? null,
    chronoraceUrl: value.chronoraceUrl ?? value.chronorace_url ?? null,
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
    ...(value.liveStartedAt !== undefined ? { liveStartedAt: value.liveStartedAt } : {}),
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
const TISSOT_API_ROOT = "https://prod.server.tissottiming.com";
const CHRONORACE_API_ROOT = "https://prod.chronorace.be/api/results";

async function getExternalJson(
  url: string,
  signal: AbortSignal,
  allowNotFound = false,
) {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) {
    throw new ApiError(`Live timing source returned ${response.status}.`, {
      code: "http",
      status: response.status,
    });
  }
  return response.json() as Promise<unknown>;
}

function containsText(value: unknown, fragment: string) {
  return stringValue(value)?.toLocaleLowerCase().includes(fragment.toLocaleLowerCase()) === true;
}

function tissotCategory(value: unknown) {
  if (containsText(value, "women junior") || containsText(value, "junior women")) return "junior_women";
  if (containsText(value, "men junior") || containsText(value, "junior men")) return "junior_men";
  if (containsText(value, "women elite") || containsText(value, "elite women")) return "elite_women";
  if (containsText(value, "men elite") || containsText(value, "elite men")) return "elite_men";
  return null;
}

function tissotSessionType(value: string) {
  if (/qual/i.test(value)) return "qualifying";
  if (/semi/i.test(value)) return "semi_final";
  if (/final/i.test(value)) return "final";
  return value.trim().toLocaleLowerCase().replaceAll(" ", "_");
}

function tissotSessionName(value: string) {
  if (/qual/i.test(value)) return "Qualification";
  if (/final/i.test(value)) return "Final";
  return value.trim();
}

async function getDirectTissotCatalog(season: number, signal: AbortSignal) {
  const competitionsPayload = await getExternalJson(
    `${TISSOT_API_ROOT}/competitions?year=${season}`,
    signal,
  );
  const competitions = (Array.isArray(competitionsPayload) ? competitionsPayload : [])
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => item !== null)
    .filter((item) =>
      stringValue(item.sport)?.toLocaleUpperCase() === "MTB" &&
      containsText(item.name, "world championship") &&
      (containsText(item.name, "downhill") ||
        containsText(item.code, "dhi") ||
        stringValue(item.code)?.toLocaleLowerCase() === "mtbwch"),
    );

  for (const competition of competitions) {
    const code = stringValue(competition.code)?.trim().toLocaleLowerCase();
    if (!code || !/^[a-z0-9_-]+$/i.test(code)) continue;
    const competitionKey = `${code}${season}`;
    const [eventsPayload, schedulePayload] = await Promise.all([
      getExternalJson(`${TISSOT_API_ROOT}/competitions/${competitionKey}/events`, signal, true),
      getExternalJson(`${TISSOT_API_ROOT}/competitions/${competitionKey}/schedule`, signal, true),
    ]);
    const events = (Array.isArray(eventsPayload) ? eventsPayload : [])
      .map(asRecord)
      .filter((item): item is Record<string, unknown> => item !== null)
      .flatMap((event) => {
        const category = tissotCategory(event.name);
        return category && (containsText(event.name, "downhill") || containsText(competition.name, "downhill"))
          ? [{ event, category }]
          : [];
      });
    if (events.length === 0) continue;
    const schedule = asRecord(schedulePayload);
    const scheduleItems = (Array.isArray(schedule?.items) ? schedule.items : [])
      .map(asRecord)
      .filter((item): item is Record<string, unknown> => item !== null);
    const sessions = (await Promise.all(events.map(async ({ event, category }) => {
      const eventNumber = numberValue(event.number);
      if (!eventNumber) return [];
      const phasesPayload = await getExternalJson(
        `${TISSOT_API_ROOT}/competitions/${competitionKey}/events/${eventNumber}/phases`,
        signal,
        true,
      );
      const phases = (Array.isArray(phasesPayload) ? phasesPayload : [])
        .map(asRecord)
        .filter((item): item is Record<string, unknown> => item !== null);
      return phases.flatMap((phase) => {
        const phaseNumber = numberValue(phase.number);
        if (!phaseNumber) return [];
        const scheduled = scheduleItems.find((item) =>
          numberValue(item.eventId) === eventNumber && numberValue(item.phaseId) === phaseNumber,
        );
        const phaseName = stringValue(phase.name) ?? stringValue(scheduled?.name) ?? "Session";
        return [{
          id: `tissot-${competitionKey}-${eventNumber}-${phaseNumber}`,
          provider: "tissot" as const,
          competitionCode: code,
          eventNumber,
          phaseNumber,
          name: tissotSessionName(phaseName),
          sessionType: tissotSessionType(phaseName),
          category,
          status: scheduled?.isLive === true
            ? "live"
            : scheduled?.hasResult === true ? "completed" : "scheduled",
          sessionDate: stringValue(scheduled?.date) ?? stringValue(phase.start),
          riderCount: null,
        }];
      });
    }))).flat();
    return tissotCatalogSchema.parse({
      provider: "tissot",
      season,
      competitionCode: code,
      competitionName: stringValue(competition.name),
      sessions,
    });
  }

  return tissotCatalogSchema.parse({
    provider: "tissot",
    season,
    competitionCode: null,
    competitionName: null,
    sessions: [],
  });
}

async function getDirectTissotResults(session: LiveSession, signal: AbortSignal) {
  const competitionKey = `${session.competitionCode?.toLocaleLowerCase()}${session.season}`;
  const phaseUrl = `${TISSOT_API_ROOT}/competitions/${encodeURIComponent(competitionKey)}/events/${session.eventNumber}/phases/${session.phaseNumber}`;
  const [resultsPayload, startList] = await Promise.all([
    getExternalJson(`${phaseUrl}/results`, signal, true),
    getExternalJson(`${phaseUrl}/startlist`, signal, true),
  ]);
  const results = asRecord(resultsPayload) ?? { results: [] };
  return { ...results, startList };
}
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
          chronoraceUrl: `${CHRONORACE_API_ROOT}/generic/uci/${encodeURIComponent(contextName)}/dh/${encodeURIComponent(key)}`,
          provider: "chronorace" as const,
          competitionCode: null,
          eventNumber: null,
          phaseNumber: null,
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

function tissotMilliseconds(value: unknown) {
  const text = stringValue(value);
  if (!text) return null;
  const normalized = text.replace(/^\+/, "").replace(",", ".");
  const parts = normalized.split(":");
  if (parts.length > 3) return null;
  let seconds = 0;
  for (const part of parts) {
    const parsed = Number(part);
    if (!Number.isFinite(parsed)) return null;
    seconds = seconds * 60 + parsed;
  }
  return seconds > 0 ? Math.round(seconds * 1_000) : null;
}

function splitTissotName(value: string | null) {
  const parts = value?.split(/\s+/).filter(Boolean) ?? [];
  const family: string[] = [];
  while (parts.length && parts[0] === parts[0].toLocaleUpperCase()) {
    family.push(parts.shift()!);
  }
  return {
    firstName: displayCase(parts.join(" ") || null),
    lastName: displayCase(family.join(" ") || null),
  };
}

export function normalizeTissotLivePayload(payload: unknown) {
  const root = asRecord(payload) ?? {};
  const sourceResults = (Array.isArray(root.results) ? root.results : [])
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => item !== null);
  const startListRoot = asRecord(root.startList);
  const sourceStartList = (Array.isArray(startListRoot?.results) ? startListRoot.results : [])
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => item !== null);
  const leader = sourceResults.find((result) => numberValue(result.rank) === 1);
  const leaderTime = tissotMilliseconds(leader?.time ?? leader?.value);
  const riders: Record<string, unknown> = {};
  const results: Record<string, unknown>[] = [];
  const onTrack: Record<string, unknown>[] = [];

  sourceResults.forEach((result, index) => {
    const rider = asRecord(result.rider) ?? {};
    const key = identifierValue(rider.uciRiderId) ?? identifierValue(rider.key) ?? String(index + 1);
    const names = splitTissotName(stringValue(rider.name));
    riders[key] = {
      RaceNr: numberValue(rider.bib),
      UciRiderId: identifierValue(rider.uciRiderId),
      GivenName: names.firstName,
      FamilyName: names.lastName,
      Nation: stringValue(rider.nation),
    };
    const rawTime = stringValue(result.time) ?? stringValue(result.value);
    const parsedTime = tissotMilliseconds(rawTime);
    const finishTime = rawTime?.startsWith("+") && leaderTime !== null && parsedTime !== null
      ? leaderTime + parsedTime
      : parsedTime;
    const rawSplits = Array.isArray(result.splits) ? result.splits : [];
    const times = rawSplits.flatMap((rawSplit) => {
      const split = asRecord(rawSplit);
      const time = tissotMilliseconds(split?.value);
      return time === null ? [] : [{ RaceTime: time, Position: numberValue(split?.rank) }];
    });
    const statusValue = stringValue(result.value)?.toUpperCase();
    const status = ["DNF", "DNS", "DSQ"].includes(statusValue ?? "")
      ? statusValue
      : finishTime !== null ? "Finished" : "On Track";
    const normalized = {
      RaceNr: key,
      Position: numberValue(result.rank),
      RaceTime: status === "Finished" ? finishTime : null,
      Status: status,
      InResult: status === "Finished",
      Speed: numberValue(result.speed),
      Times: times,
    };
    results.push(normalized);
    if ((result.approaching === true || (numberValue(result.progression) ?? 0) > 0) && finishTime === null) {
      onTrack.push({ ...normalized, SortOrder: index + 1 });
    }
  });

  const resultRiderKeys = new Set(Object.keys(riders));
  sourceStartList.forEach((entry, index) => {
    const rider = asRecord(entry.rider) ?? {};
    const key = identifierValue(rider.uciRiderId) ?? identifierValue(rider.key) ?? `start-${index + 1}`;
    if (resultRiderKeys.has(key)) return;
    const names = splitTissotName(stringValue(rider.name));
    riders[key] = {
      RaceNr: numberValue(rider.bib),
      UciRiderId: identifierValue(rider.uciRiderId),
      GivenName: names.firstName,
      FamilyName: names.lastName,
      Nation: stringValue(rider.nation),
    };
    results.push({
      RaceNr: key,
      Position: null,
      RaceTime: null,
      Status: "Upcoming",
      InResult: false,
      Speed: null,
      Times: [],
      StartOrder: numberValue(entry.rank) ?? index + 1,
      StartTime: stringValue(entry.value),
    });
  });

  return {
    Riders: riders,
    Results: results,
    OnTrack: onTrack,
    NextToStart: results.filter((result) => result.Status === "Upcoming"),
  };
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
  startTime?: string | null;
  liveStartedAt?: number;
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
  const resultRaceNumbers = new Set(allResults.flatMap((result) => {
    const raceNumber = identifierValue(result.RaceNr) ?? identifierValue(result.Key);
    return raceNumber ? [raceNumber] : [];
  }));
  const sourceRiders = asRecord(root.Riders) ?? {};
  const availableStartListCount = Object.entries(sourceRiders)
    .filter(([technicalKey, rawRider]) => {
      const raceNumber = identifierValue(asRecord(rawRider)?.RaceNr);
      return !resultRaceNumbers.has(technicalKey) &&
        (!raceNumber || !resultRaceNumbers.has(raceNumber));
    }).length;
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
      toStart: Math.max(
        Array.isArray(root.NextToStart) ? root.NextToStart.length : 0,
        availableStartListCount,
      ),
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
  const sourceResults = Array.isArray(root.Results) ? root.Results : [];
  const resultRaceNumbers = new Set(sourceResults.flatMap((raw) => {
    const result = asRecord(raw);
    const raceNumber = identifierValue(result?.RaceNr) ?? identifierValue(result?.Key);
    return raceNumber ? [raceNumber] : [];
  }));
  const startListResults = Object.entries(riders).flatMap(([technicalKey, rawRider]) => {
    const rider = asRecord(rawRider);
    if (!rider) return [];
    const bib = identifierValue(rider.RaceNr);
    if (resultRaceNumbers.has(technicalKey) || (bib && resultRaceNumbers.has(bib))) {
      return [];
    }
    return [{
      RaceNr: technicalKey,
      Position: null,
      RaceTime: null,
      Status: "Upcoming",
      InResult: false,
      Times: [],
    }];
  });
  const rawResults = [...sourceResults, ...startListResults];
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
    const status = isOnTrack ? "On Track" : stringValue(result.Status);
    const hasInvalidFinish = ["DNF", "DNS", "DSQ"].includes(status?.trim().toUpperCase() ?? "");
    // For non-finishers RaceTime can be a partial clock, not a finish time.
    const finalTime = isOnTrack || hasInvalidFinish ? null : chronoMilliseconds(result.RaceTime);
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
      return sectorTime > 0
        ? [{ index: timing.index, name: `Sector ${timing.index}`, time: sectorTime }]
        : [];
    });
    if (!isOnTrack && finalTime !== null && finalTime > previous) {
      const index = (cumulativeTimes.at(-1)?.index ?? 0) + 1;
      times.push({ index, name: `Sector ${index}`, time: finalTime - previous });
    }
    const rawPosition = numberValue(result.Position);
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
        startTime: stringValue(result.StartTime) ?? stringValue(rider.StartTime),
        isOnTrack,
        ...(isOnTrack && chronoMilliseconds(result.RaceTime) !== null
          ? { liveStartedAt: Date.now() - chronoMilliseconds(result.RaceTime)! * 1000 }
          : {}),
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
      startTime: result.startTime,
      ...(result.liveStartedAt !== undefined ? { liveStartedAt: result.liveStartedAt } : {}),
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
      startTime: null,
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
      splitCount: 4,
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
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useChronoRaceCatalog(round: LiveRound | null | undefined) {
  const context = round?.contextName ?? "";
  const isWorldChampionship =
    round?.competitionClassCode?.toLowerCase() === "wch" ||
    round?.competitionClassName?.toLowerCase().includes("world champ") === true;
  const useTissot = Boolean(round && isWorldChampionship);
  const catalogKey = useTissot ? `tissot-${round?.season ?? ""}` : context;
  return useQuery({
    queryKey: liveQueryKeys.catalog(catalogKey),
    enabled: Boolean(round && (useTissot || context.length > 0)),
    queryFn: ({ signal }) => useTissot
      ? getDirectTissotCatalog(round?.season ?? new Date().getUTCFullYear(), signal)
      : getExternalJson(
          `${CHRONORACE_API_ROOT}/uci/dh/cms/${encodeURIComponent(context)}`,
          signal,
        ),
    select: (payload) => {
      if (!round) return [];
      const tissot = tissotCatalogSchema.safeParse(payload);
      if (tissot.success) {
        return tissot.data.sessions.map((session) => liveSessionRawSchema.parse({
          ...session,
          round_id: round.roundId,
          rounds: {
            id: round.roundId,
            round_number: round.roundNumber,
            season_year: round.season,
            context_name: null,
            competition_levels: {
              code: round.competitionClassCode,
              name: round.competitionClassName ?? tissot.data.competitionName,
            },
            tracks: {
              name: round.trackName,
              venue: round.venueName,
              country_code: round.countryCode,
            },
          },
        }));
      }
      return discoverChronoRaceSessions(payload, round);
    },
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
    queryKey: liveQueryKeys.chronoResults(session?.provider ?? "chronorace", `${context}-${key}`),
    enabled: Boolean(session?.id && (session.provider === "tissot" || session.contextName)),
    queryFn: async ({ signal }) => {
      if (!session || !key)
        throw new ApiError("ChronoRace source is not configured for this session.", {
          code: "validation",
        });
      const payload = session.provider === "tissot"
        ? await getDirectTissotResults(session, signal)
        : await getExternalJson(
            `${CHRONORACE_API_ROOT}/generic/uci/${encodeURIComponent(context)}/dh/${encodeURIComponent(key)}`,
            signal,
          );
      const resultPayload = session.provider === "tissot"
        ? normalizeTissotLivePayload(payload)
        : (asRecord(payload) ?? { Riders: {}, Results: [] });
      const status = session.provider === "tissot"
        ? session.status
        : resolveChronoRaceSessionStatus(resultPayload);
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
