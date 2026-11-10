import type { LiveSession } from "./live-models";
import { tissotCatalogSchema } from "./live-models";
import {
  asRecord,
  numberValue,
  stringValue,
  identifierValue,
  displayCase,
} from "./live-values";
import { getExternalJson, TISSOT_API_ROOT } from "./live-transport";

function containsText(value: unknown, fragment: string) {
  return (
    stringValue(value)
      ?.toLocaleLowerCase()
      .includes(fragment.toLocaleLowerCase()) === true
  );
}

function tissotCategory(value: unknown) {
  if (
    containsText(value, "women junior") ||
    containsText(value, "junior women")
  )
    return "junior_women";
  if (containsText(value, "men junior") || containsText(value, "junior men"))
    return "junior_men";
  if (containsText(value, "women elite") || containsText(value, "elite women"))
    return "elite_women";
  if (containsText(value, "men elite") || containsText(value, "elite men"))
    return "elite_men";
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

export async function getDirectTissotCatalog(
  season: number,
  signal: AbortSignal,
) {
  const competitionsPayload = await getExternalJson(
    `${TISSOT_API_ROOT}/competitions?year=${season}`,
    signal,
  );
  const competitions = (
    Array.isArray(competitionsPayload) ? competitionsPayload : []
  )
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => item !== null)
    .filter(
      (item) =>
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
      getExternalJson(
        `${TISSOT_API_ROOT}/competitions/${competitionKey}/events`,
        signal,
        true,
      ),
      getExternalJson(
        `${TISSOT_API_ROOT}/competitions/${competitionKey}/schedule`,
        signal,
        true,
      ),
    ]);
    const events = (Array.isArray(eventsPayload) ? eventsPayload : [])
      .map(asRecord)
      .filter((item): item is Record<string, unknown> => item !== null)
      .flatMap((event) => {
        const category = tissotCategory(event.name);
        return category &&
          (containsText(event.name, "downhill") ||
            containsText(competition.name, "downhill"))
          ? [{ event, category }]
          : [];
      });
    if (events.length === 0) continue;
    const schedule = asRecord(schedulePayload);
    const scheduleItems = (Array.isArray(schedule?.items) ? schedule.items : [])
      .map(asRecord)
      .filter((item): item is Record<string, unknown> => item !== null);
    const sessions = (
      await Promise.all(
        events.map(async ({ event, category }) => {
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
            const scheduled = scheduleItems.find(
              (item) =>
                numberValue(item.eventId) === eventNumber &&
                numberValue(item.phaseId) === phaseNumber,
            );
            const phaseName =
              stringValue(phase.name) ??
              stringValue(scheduled?.name) ??
              "Session";
            return [
              {
                id: `tissot-${competitionKey}-${eventNumber}-${phaseNumber}`,
                provider: "tissot" as const,
                competitionCode: code,
                eventNumber,
                phaseNumber,
                name: tissotSessionName(phaseName),
                sessionType: tissotSessionType(phaseName),
                category,
                status:
                  scheduled?.isLive === true
                    ? "live"
                    : scheduled?.hasResult === true
                      ? "completed"
                      : "scheduled",
                sessionDate:
                  stringValue(scheduled?.date) ?? stringValue(phase.start),
                riderCount: null,
              },
            ];
          });
        }),
      )
    ).flat();
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

export async function getDirectTissotResults(
  session: LiveSession,
  signal: AbortSignal,
) {
  const competitionKey = `${session.competitionCode?.toLocaleLowerCase()}${session.season}`;
  const phaseUrl = `${TISSOT_API_ROOT}/competitions/${encodeURIComponent(competitionKey)}/events/${session.eventNumber}/phases/${session.phaseNumber}`;
  const [resultsPayload, startList] = await Promise.all([
    getExternalJson(`${phaseUrl}/results`, signal, true),
    getExternalJson(`${phaseUrl}/startlist`, signal, true),
  ]);
  const results = asRecord(resultsPayload) ?? { results: [] };
  return { ...results, startList };
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
  const sourceStartList = (
    Array.isArray(startListRoot?.results) ? startListRoot.results : []
  )
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => item !== null);
  const leader = sourceResults.find((result) => numberValue(result.rank) === 1);
  const leaderTime = tissotMilliseconds(leader?.time ?? leader?.value);
  const riders: Record<string, unknown> = {};
  const results: Record<string, unknown>[] = [];
  const onTrack: Record<string, unknown>[] = [];

  sourceResults.forEach((result, index) => {
    const rider = asRecord(result.rider) ?? {};
    const key =
      identifierValue(rider.uciRiderId) ??
      identifierValue(rider.key) ??
      String(index + 1);
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
    const finishTime =
      rawTime?.startsWith("+") && leaderTime !== null && parsedTime !== null
        ? leaderTime + parsedTime
        : parsedTime;
    const rawSplits = Array.isArray(result.splits) ? result.splits : [];
    const times = rawSplits.flatMap((rawSplit) => {
      const split = asRecord(rawSplit);
      const time = tissotMilliseconds(split?.value);
      return time === null
        ? []
        : [{ RaceTime: time, Position: numberValue(split?.rank) }];
    });
    const statusValue = stringValue(result.value)?.toUpperCase();
    const status = ["DNF", "DNS", "DSQ"].includes(statusValue ?? "")
      ? statusValue
      : finishTime !== null
        ? "Finished"
        : "On Track";
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
    if (
      (result.approaching === true ||
        (numberValue(result.progression) ?? 0) > 0) &&
      finishTime === null
    ) {
      onTrack.push({ ...normalized, SortOrder: index + 1 });
    }
  });

  const resultRiderKeys = new Set(Object.keys(riders));
  sourceStartList.forEach((entry, index) => {
    const rider = asRecord(entry.rider) ?? {};
    const key =
      identifierValue(rider.uciRiderId) ??
      identifierValue(rider.key) ??
      `start-${index + 1}`;
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
