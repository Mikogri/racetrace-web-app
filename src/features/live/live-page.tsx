import { useMemo, type CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TableFeedbackState } from "../../components/feedback/states";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { routes } from "../../config/routes";
import { formatCategoryLabel } from "../../utils/categories";
import { formatLiveSessionLabel, formatSessionLabel, useDomainMetadata } from "../../utils/domain-metadata";
import {
  useChronoRaceSessionResults,
  useChronoRaceCatalog,
  useLiveRound,
  type LiveSession,
} from "./api/get-live";
import { LiveStatusBadge } from "./components/live-status-badge";
import styles from "./live-page.module.css";
import { pageMeta } from "../../config/seo";
import { usePageMeta } from "../../hooks/use-page-meta";

function groupSessions(items: LiveSession[]) {
  const groups = new Map<string, LiveSession[]>();
  const previousByCategory = new Map<string | null, string>();
  const earlierStages = new Map<string, Set<string>>();
  const laterStageCounts = new Map<string, number>();
  for (const session of items) {
    const key = session.sessionType ?? session.name;
    groups.set(key, [...(groups.get(key) ?? []), session]);
    const previous = previousByCategory.get(session.category);
    // Catalog stages are chronological within each category. Display later stages first.
    if (previous !== undefined && previous !== key) {
      const earlier = earlierStages.get(key) ?? new Set<string>();
      if (!earlier.has(previous)) {
        earlier.add(previous);
        laterStageCounts.set(previous, (laterStageCounts.get(previous) ?? 0) + 1);
      }
      earlierStages.set(key, earlier);
    }
    previousByCategory.set(session.category, key);
  }
  const pending = new Set(groups.keys());
  const ordered: string[] = [];
  while (pending.size > 0) {
    const key = [...pending].find((stage) => !laterStageCounts.get(stage));
    // Conflicting provider sequences: retain remaining catalog order, without losing groups.
    if (key === undefined) { ordered.push(...pending); break; }
    pending.delete(key);
    ordered.push(key);
    for (const earlier of earlierStages.get(key) ?? []) {
      laterStageCounts.set(earlier, laterStageCounts.get(earlier)! - 1);
    }
  }
  return ordered.map((key) => ({ key, label: formatSessionLabel(key, "groupName"), sessions: groups.get(key)! }));
}

function LiveSessionCard({ session, enterIndex }: { session: LiveSession; enterIndex: number }) {
  useDomainMetadata();
  const timingQuery = useChronoRaceSessionResults(session);
  const riderCount = timingQuery.data?.results.totalItems ?? session.riderCount;
  const status = timingQuery.data?.status ?? session.status;

  return (
    <Link
      to={routes.liveResults(
        session.id,
        session.contextName ?? undefined,
        session.roundId ?? undefined,
        session.season ?? undefined,
      )}
      className={`${styles.sessionCard} ${styles.sessionCardEnter}`}
      style={{ "--card-enter-delay": `${enterIndex * 37.5}ms` } as CSSProperties}
    >
      <div className={styles.cardCopy}>
        <div className={styles.cardHeader}>
          <strong>{formatCategoryLabel(session.category)}</strong>
          <span>{formatLiveSessionLabel(session, "shortName")}</span>
        </div>
        <div className={styles.cardMeta}>
          <LiveStatusBadge status={status} />
          <span className={styles.riderCount}>
            {riderCount ?? "--"} {riderCount === 1 ? "Rider" : "Riders"}
          </span>
        </div>
      </div>
      <span className={styles.cardArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export default function LivePage() {
  usePageMeta(pageMeta.live);
  useDomainMetadata();
  const [searchParams] = useSearchParams();
  const seasonParam = searchParams.get("season");
  const requestedSeason = seasonParam === null ? Number.NaN : Number(seasonParam);
  const season = Number.isInteger(requestedSeason)
    ? requestedSeason
    : new Date().getUTCFullYear();
  const requestedRoundId = searchParams.get("roundId");
  const liveRoundQuery = useLiveRound({ season, roundId: requestedRoundId });
  const detectedRoundId = liveRoundQuery.data?.roundId ?? null;
  const catalogQuery = useChronoRaceCatalog(liveRoundQuery.data);
  const sessions = useMemo(() => catalogQuery.data ?? [], [catalogQuery.data]);
  const groups = groupSessions(sessions);
  const sessionEnterIndexes = useMemo(
    () => new Map(sessions.map((session, index) => [session.id, index])),
    [sessions],
  );
  const context = sessions[0];
  const isPending =
    liveRoundQuery.isPending ||
    (Boolean(detectedRoundId) && catalogQuery.isPending);
  const error =
    (!liveRoundQuery.data ? liveRoundQuery.error : null) ??
    (sessions.length === 0 ? catalogQuery.error : null);
  const retry = () => {
    void liveRoundQuery.refetch();
    if (detectedRoundId) void catalogQuery.refetch();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Live Timing"
        eyebrow={[
          `${liveRoundQuery.data?.season ?? context?.season ?? season} Season`,
          liveRoundQuery.data?.competitionClassName ?? context?.competitionName ?? "Competition",
          liveRoundQuery.data?.roundNumber ?? context?.roundNumber
            ? `Round ${liveRoundQuery.data?.roundNumber ?? context?.roundNumber}`
            : "Round --",
        ].join(" / ")}
        description="Follow live downhill sessions as they happen. Track rider positions, sector performance, time gaps and leaderboard changes in real time."
      />

      <Section>
        {isPending ? <TableFeedbackState type="loading" /> : null}
        {error ? (
          <TableFeedbackState type="error" onRetry={retry} />
        ) : null}
        {!isPending && !error && !detectedRoundId ? (
          <TableFeedbackState
            type="empty"
            label="No live round"
            description="There is no active downhill round right now."
          />
        ) : null}
        {!isPending && !error && detectedRoundId && sessions.length === 0 ? (
          <TableFeedbackState
            type="empty"
            label="No data available"
            description="There are no sessions available for this round."
          />
        ) : null}

        {groups.length > 0 ? (
          <div className={styles.sessionGroups}>
            {groups.map((group) => (
              <section className={styles.sessionGroup} key={group.key}>
                <h2>{group.label}</h2>
                <div className={styles.sessionGrid}>
                  {group.sessions.map((session) => (
                    <LiveSessionCard session={session} enterIndex={sessionEnterIndexes.get(session.id) ?? 0} key={session.id} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </Section>
    </PageContainer>
  );
}
