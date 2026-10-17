import { ApiError } from "../../../types/api";
import { sessionResultsSchema } from "./live-models";
import type { LiveSession, SessionResults, LiveCourseRider, LiveTimingSummary } from "./live-models";
import { activeChronoOnTrack } from "./chronorace-provider";
import { asRecord, numberValue, stringValue, identifierValue, displayCase, chronoMilliseconds } from "./live-values";

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
      return timing && time !== null
        ? [{ split: index + 1, time, position: position !== null && position > 0 ? Math.trunc(position) : null }]
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
  const onTrackResults = activeChronoOnTrack(root);
  const onTrackRaceNumbers = new Set(
    onTrackResults.flatMap((result) => {
      const raceNumber = identifierValue(result?.RaceNr) ?? identifierValue(result?.Key);
      return raceNumber ? [raceNumber] : [];
    }),
  );
  const resultsByRaceNumber = new Map<string, Record<string, unknown>>();
  for (const raw of [...(Array.isArray(root.Results) ? root.Results : []), ...onTrackResults]) {
    const result = asRecord(raw);
    if (!result) continue;
    const key = identifierValue(result.RaceNr) ?? identifierValue(result.Key);
    if (key) resultsByRaceNumber.set(key, { ...resultsByRaceNumber.get(key), ...result });
  }
  const sourceResults = [...resultsByRaceNumber.values()];
  const splitTimes = sourceResults.map((result) =>
    (Array.isArray(result.Times) ? result.Times : []).slice(0, 4).map((raw) =>
      chronoMilliseconds(asRecord(raw)?.RaceTime),
    ),
  );
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
    const latestSplit = cumulativeTimes.filter((timing) => timing.index <= 4).at(-1);
    const position = isOnTrack
      ? latestSplit
        ? 1 + splitTimes.filter((splits) => {
            const time = splits[latestSplit.index - 1];
            return time != null && time < latestSplit.time;
          }).length
        : null
      : rawPosition && rawPosition > 0 ? Math.trunc(rawPosition) : null;
    return [
      {
        key: raceNumber,
        position,
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
