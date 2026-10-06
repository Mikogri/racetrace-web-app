import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from '../../../lib/api-client';
import { formatLiveSessionLabel } from '../../../utils/domain-metadata';
import type { LiveSession } from './get-live';
import { chronoRaceSessionSnapshotOptions, normalizeChronoRacePayload } from './get-live';

const contextSchema = z.object({ eligible: z.boolean(), session_types: z.array(z.string()) });
const projectionSchema = z.object({
  items: z.array(z.object({ rider_id: z.string().nullable(), uci_id: z.string(), name: z.string(), points: z.number() })),
  lead: z.number().nullable(), can_change: z.boolean().nullable(),
  status: z.enum(['unavailable', 'incomplete', 'tied', 'open', 'secured', 'decided']),
});

export function championshipSession(session: LiveSession, snapshot: { results: ReturnType<typeof normalizeChronoRacePayload>; status: string }) {
  return {
    session_type: formatLiveSessionLabel(session, 'code'),
    complete: snapshot.status === 'completed',
    riders: snapshot.results.items.filter(item => !item.isPerfectRun).map(item => {
      const status = item.status?.trim().toLowerCase();
      const terminal = status === 'dnf' || status === 'dns' || status === 'dsq';
      const state = terminal ? status : status !== 'on track' && item.finalTime !== null && item.position !== null ? 'finished' : 'pending';
      return {
        uci_id: item.uciId,
        name: item.fullName,
        position: state === 'finished' ? item.position : null,
        state,
      };
    }),
  };
}

export function useLiveChampionship(session: LiveSession, catalog: LiveSession[], currentSnapshot: Parameters<typeof championshipSession>[1]) {
  const path = `/api/v1/live/rounds/${encodeURIComponent(session.roundId ?? '')}/championship`;
  const context = useQuery({
    queryKey: ['live-championship-context', session.roundId, session.category],
    queryFn: ({ signal }) => apiClient.get(path, contextSchema, { signal, query: { category: session.category } }),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
  const sources = context.data?.eligible ? catalog.filter(item =>
    item.id !== session.id && item.category === session.category && context.data.session_types.includes(formatLiveSessionLabel(item, 'code')),
  ) : [];
  const snapshots = useQueries({ queries: sources.map(source => chronoRaceSessionSnapshotOptions(source)) });
  const sourceError = snapshots.find(query => query.isError)?.error;
  const ready = context.data?.eligible && context.data.session_types.includes('final') && snapshots.every(query => Boolean(query.data)) && !sourceError;
  // Reuse the final snapshot already polled by the leaderboard; do not add a second polling timer.
  const body = ready ? [championshipSession(session, currentSnapshot), ...sources.map((source, index) => championshipSession(source, snapshots[index].data!))] : [];
  const projection = useQuery({
    queryKey: ['live-championship', session.roundId, session.category, context.dataUpdatedAt, body],
    enabled: Boolean(ready),
    queryFn: ({ signal }) => apiClient.post(path, projectionSchema, body, { signal, query: { category: session.category } }),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: 0,
  });
  return {
    eligible: context.data?.eligible ?? false,
    data: projection.data,
    error: context.error ?? sourceError ?? projection.error,
    loading: context.isPending || (Boolean(context.data?.session_types.includes('final')) && !projection.data && !sourceError && projection.isPending),
    retry: () => { void context.refetch(); snapshots.forEach(query => { void query.refetch(); }); if (ready) void projection.refetch(); },
  };
}
