import type { LiveRound, LiveSession } from "./live-models";
import { normalizeCategoryValue } from "../../../utils/categories";
import { asRecord, numberValue, stringValue, identifierValue } from "./live-values";
import { CHRONORACE_API_ROOT } from "./live-transport";

type ChronoCatalogNode = {
  Id: string | undefined;
  Name: string | undefined;
  DisplayName: string | undefined;
  Route: string | undefined;
  Childs: ChronoCatalogNode[];
};

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

export function activeChronoOnTrack(root: Record<string, unknown>) {
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
