import { useMemo, type CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TableFeedbackState } from "../../components/feedback/states";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { routes } from "../../config/routes";
import { formatCategoryLabel, normalizeCategoryValue } from "../../utils/categories";
import {
  useChronoRaceSessionResults,
  useChronoRaceCatalog,
  useLiveRound,
  type LiveSession,
} from "./api/get-live";
import { LiveStatusBadge } from "./components/live-status-badge";
import styles from "./live-page.module.css";

function sessionGroupLabel(sessionType: string | null) {
  if (!sessionType) return "Sessions";
  return sessionType
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/^Final$/, "Finals");
}

function sessionCardLabel(name: string) {
  if (!/qual(?:i|ification|ifying)/i.test(name)) return name;
  const sequence = name.match(/(?:^|\D)([12])(?:\D|$)/)?.[1];
  return sequence ? `Quali ${sequence}` : "Quali";
}

function groupSessions(items: LiveSession[]) {
  const groups = new Map<string, LiveSession[]>();
  for (const session of items) {
    const key = session.sessionType ?? session.name;
    groups.set(key, [...(groups.get(key) ?? []), session]);
  }
  const categoryOrder = ["elite_men", "elite_women", "junior_men", "junior_women"];
  const stageOrder = (key: string, sessions: LiveSession[]) => {
    const label = `${key} ${sessions.map((session) => session.name).join(" ")}`.toLowerCase();
    if (/semi[\s_-]?final|pre[\s_-]?final/.test(label)) return 1;
    if (/\bfinals?\b/.test(label)) return 0;
    if (/qual(?:i|ification|ifying)/.test(label)) return 2;
    if (/seeding/.test(label)) return 3;
    return 4;
  };
  const categoryRank = (sessions: LiveSession[]) => {
    const ranks = sessions.map((session) => {
      const normalized = normalizeCategoryValue(session.category);
      const index = normalized ? categoryOrder.indexOf(normalized) : -1;
      return index < 0 ? categoryOrder.length : index;
    });
    return Math.min(...ranks);
  };

  return [...groups.entries()]
    .map(([key, sessions], index) => ({
      key,
      label: sessionGroupLabel(key),
      sessions,
      stageRank: stageOrder(key, sessions),
      categoryRank: categoryRank(sessions),
      index,
    }))
    .sort((left, right) =>
      left.stageRank - right.stageRank ||
      left.categoryRank - right.categoryRank ||
      left.index - right.index,
    );
}

function LiveSessionCard({ session, enterIndex }: { session: LiveSession; enterIndex: number }) {
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
          <span>{sessionCardLabel(session.name)}</span>
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
  const groups = useMemo(() => groupSessions(sessions), [sessions]);
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
