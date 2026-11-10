import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";
import { ApiError } from "../../../types/api";
import { GLOBAL_PAGE_SIZE } from "../../../config/pagination";
import { liveQueryKeys } from "./live-query-keys";
import {
  liveRoundsResponseSchema,
  liveRoundContextSchema,
  resolvedRidersSchema,
  tissotCatalogSchema,
  liveSessionRawSchema,
} from "./live-models";
import type { LiveRound, LiveSession } from "./live-models";
import {
  isLiveRoundStatus,
  discoverChronoRaceSessions,
  resolveChronoRaceSessionStatus,
} from "./chronorace-provider";
import {
  getDirectTissotCatalog,
  getDirectTissotResults,
  normalizeTissotLivePayload,
} from "./tissot-provider";
import { getExternalJson, CHRONORACE_API_ROOT } from "./live-transport";
import { asRecord } from "./live-values";
import {
  normalizeChronoRacePayload,
  liveTimingPresentation,
} from "./live-normalization";

const LIVE_REFRESH_INTERVAL = 3_000;

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
        ? (activeRounds.find((round) => round.roundId === params.roundId) ??
          null)
        : (activeRounds[0] ?? null);
      if (!selected) return null;
      if (selected.contextName) return selected;
      const detail = await apiClient.get(
        `/api/v1/rounds/${encodeURIComponent(selected.roundId)}`,
        liveRoundContextSchema,
        { signal },
      );
      return { ...selected, contextName: detail.contextName ?? null };
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
    queryFn: ({ signal }) =>
      useTissot
        ? getDirectTissotCatalog(
            round?.season ?? new Date().getUTCFullYear(),
            signal,
          )
        : getExternalJson(
            `${CHRONORACE_API_ROOT}/uci/dh/cms/${encodeURIComponent(context)}`,
            signal,
          ),
    select: (payload) => {
      if (!round) return [];
      const tissot = tissotCatalogSchema.safeParse(payload);
      if (tissot.success) {
        return tissot.data.sessions.map((session) =>
          liveSessionRawSchema.parse({
            ...session,
            roundId: round.roundId,
            rounds: {
              id: round.roundId,
              roundNumber: round.roundNumber,
              seasonYear: round.season,
              contextName: null,
              competitionLevels: {
                code: round.competitionClassCode,
                name: round.competitionClassName ?? tissot.data.competitionName,
              },
              tracks: {
                name: round.trackName,
                venue: round.venueName,
                countryCode: round.countryCode,
              },
            },
          }),
        );
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
    select: (data) =>
      new Map(data.items.map((item) => [item.uciId, item.riderId])),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function chronoRaceSessionSnapshotOptions(
  session: LiveSession | undefined,
) {
  const context = session?.contextName ?? "";
  const key = session?.id ?? "";
  return queryOptions({
    queryKey: liveQueryKeys.chronoResults(
      session?.provider ?? "chronorace",
      `${context}-${key}`,
    ),
    enabled: Boolean(
      session?.id && (session.provider === "tissot" || session.contextName),
    ),
    queryFn: async ({ signal }) => {
      if (!session || !key)
        throw new ApiError(
          "ChronoRace source is not configured for this session.",
          {
            code: "validation",
          },
        );
      const payload =
        session.provider === "tissot"
          ? await getDirectTissotResults(session, signal)
          : await getExternalJson(
              `${CHRONORACE_API_ROOT}/generic/uci/${encodeURIComponent(context)}/dh/${encodeURIComponent(key)}`,
              signal,
            );
      const resultPayload =
        session.provider === "tissot"
          ? normalizeTissotLivePayload(payload)
          : (asRecord(payload) ?? { Riders: {}, Results: [] });
      const status =
        session.provider === "tissot"
          ? session.status
          : resolveChronoRaceSessionStatus(resultPayload);
      const presentation = liveTimingPresentation(resultPayload);
      return {
        status,
        results: normalizeChronoRacePayload(resultPayload, {
          ...session,
          status,
        }),
        ...presentation,
      };
    },
    refetchInterval: LIVE_REFRESH_INTERVAL,
  });
}

export function useChronoRaceSessionSnapshot(session: LiveSession | undefined) {
  return useQuery(chronoRaceSessionSnapshotOptions(session));
}

export function useChronoRaceSessionResults(session: LiveSession | undefined) {
  return useChronoRaceSessionSnapshot(session);
}
