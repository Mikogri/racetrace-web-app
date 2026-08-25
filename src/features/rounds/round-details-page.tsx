import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRequiredRouteParam } from "../../app/routes/use-required-route-param";
import { RouteLoadingPage } from "../../app/routes/route-states";
import type { SortDirection } from "../../components/data-display/data-table";
import { normalizeDisplayName } from "../../utils/display-name";
import {
  ErrorState,
  LoadingState,
  TableFeedbackState,
} from "../../components/feedback/states";
import {
  PageContainer,
  PageHeader,
} from "../../components/layout/page-container";
import { Pagination } from "../../components/navigation/pagination";
import { BackButton } from "../../components/navigation/back-button";
import { SegmentedControl } from "../../components/navigation/segmented-control";
import { RiderLink } from "../../components/navigation/rider-navigation";
import { AppTooltip } from "../../components/overlays/tooltip";
import { SummaryBanner } from "../../components/ui/panel";
import { formatGap, formatRaceTime } from "../../utils/formatters";
import { routes } from "../../config/routes";
import {
  formatCategoryLabel,
  sortCategoryValues,
} from "../../utils/categories";
import type { SessionResults } from "../live/api/get-live";
import {
  SessionResultsTable,
  type ResultSort,
} from "../results/components/session-results-table";
import {
  useRoundDetails,
  useRoundResults,
  useRoundSessions,
} from "./api/get-round";
import styles from "./round-details-page.module.css";

function sessionLabel(value: string) {
  const normalized = value.toLowerCase().replaceAll("-", "_");
  const labels: Record<string, string> = {
    q: "Quali",
    quali: "Quali",
    qualifying: "Quali",
    qualification: "Quali",
    qualifying_1: "Quali 1",
    qualifying_2: "Quali 2",
    sf: "Semi Final",
    semi_final: "Semi Final",
    f: "Final",
    final: "Final",
    seeding: "Seeding",
  };
  return (
    labels[normalized] ??
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function sessionFullLabel(value: string) {
  const normalized = value.toLowerCase().replaceAll("-", "_");
  const labels: Record<string, string> = {
    q: "Qualifying",
    quali: "Qualifying",
    qualifying: "Qualifying",
    qualification: "Qualifying",
    qualifying_1: "Qualifying 1",
    qualifying_2: "Qualifying 2",
    sf: "Semi Final",
    semi_final: "Semi Final",
    f: "Final",
    final: "Final",
    seeding: "Seeding",
  };
  return labels[normalized] ?? sessionLabel(value);
}

function Podium({ data }: { data: SessionResults | undefined }) {
  const podium = [2, 1, 3].map((position) =>
    data?.items.find(
      (item) => !item.isPerfectRun && item.position === position,
    ),
  );
  if (!data || podium.every((item) => !item)) return null;

  return (
    <section className={styles.podium} aria-label="Podium">
      {podium.map((rider, index) => {
        const position = [2, 1, 3][index];
        if (!rider)
          return <div className={styles.podiumPlaceholder} key={position} />;
        const riderName = normalizeDisplayName(rider.fullName);
        const teamName = rider.teamName
          ? normalizeDisplayName(rider.teamName)
          : "--";
        return (
          <article
            className={`${styles.podiumColumn} ${styles[`podiumPosition${position}`]}`}
            key={rider.resultId ?? position}
          >
            <div className={styles.podiumCard}>
              <div className={styles.podiumIdentity}>
                <strong className={styles.podiumPosition}>{position}</strong>
                <div>
                  {rider.riderId ? (
                    <AppTooltip content={riderName}>
                      <RiderLink riderId={rider.riderId}>{riderName}</RiderLink>
                    </AppTooltip>
                  ) : (
                    <AppTooltip content={riderName}>
                      <span>{riderName}</span>
                    </AppTooltip>
                  )}
                  <AppTooltip content={teamName}>
                    <small>{teamName}</small>
                  </AppTooltip>
                </div>
              </div>
              <div className={styles.podiumTime}>
                <span>{formatRaceTime(rider.finalTime)}</span>
                <small>
                  {position === 1 ? "Winner" : formatGap(rider.finalGapToBest)}
                </small>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default function RoundDetailsPage() {
  const roundId = useRequiredRouteParam("roundId");
  const [searchParams, setSearchParams] = useSearchParams();
  const roundQuery = useRoundDetails(roundId);
  const sessionsQuery = useRoundSessions(roundId);
  const [category, setCategory] = useState(
    () => searchParams.get("category") ?? "elite_men",
  );
  const [sessionType, setSessionType] = useState("");
  const [timeView, setTimeView] = useState<"sectors" | "splits">("sectors");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<ResultSort>("finalTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const categories = useMemo(
    () =>
      sortCategoryValues(
        (sessionsQuery.data?.items ?? [])
          .map((item) => item.category)
          .filter((item): item is string => Boolean(item)),
      ),
    [sessionsQuery.data],
  );
  const selectedCategory = categories.includes(category)
    ? category
    : (categories.find((item) => item === "elite_men") ?? categories[0] ?? "");
  const sessionTypes = useMemo(
    () => [
      ...new Set(
        (sessionsQuery.data?.items ?? [])
          .filter((item) => item.category === selectedCategory)
          .map((item) => item.sessionType)
          .filter((item): item is string => Boolean(item)),
      ),
    ],
    [selectedCategory, sessionsQuery.data],
  );
  const selectedSessionType = sessionTypes.includes(sessionType)
    ? sessionType
    : (sessionTypes.find((item) => item === "final") ?? sessionTypes[0] ?? "");

  const resultsQuery = useRoundResults({
    roundId,
    category: selectedCategory,
    sessionType: selectedSessionType,
    page,
    timeView,
    sortBy,
    sortDirection,
  });
  const podiumQuery = useRoundResults({
    roundId,
    category: selectedCategory,
    sessionType: selectedSessionType,
    page: 1,
    timeView,
    sortBy: "finalTime",
    sortDirection: "desc",
  });
  const loadingPage = roundQuery.isPending || sessionsQuery.isPending;
  const pageError = roundQuery.error ?? sessionsQuery.error;
  const round = roundQuery.data;
  const results = resultsQuery.data;

  const updateSort = (nextSort: ResultSort) => {
    setSortDirection((current) =>
      sortBy === nextSort && current === "desc" ? "asc" : "desc",
    );
    setSortBy(nextSort);
    setPage(1);
  };

  if (loadingPage) return <RouteLoadingPage />;

  return (
    <PageContainer>
      <div className={styles.pageHeaderStack}>
        <BackButton fallback={routes.results} />
        <PageHeader
          title={round?.title ?? "Round Details"}
          eyebrow={[
            round?.season ? `${round.season} Season` : "---- Season",
            round?.competitionName ?? "Competition",
            round?.roundNumber ? `Round ${round.roundNumber}` : "Round --",
          ].join(" / ")}
          description="Explore track details, race sessions, conditions, results, and all the key information from the event."
        />
      </div>

      {pageError ? (
        <ErrorState
          message={pageError.message}
          onRetry={() => {
            void roundQuery.refetch();
            void sessionsQuery.refetch();
          }}
        />
      ) : null}

      {round && sessionsQuery.data ? (
        sessionsQuery.data.items.length === 0 ? (
          <TableFeedbackState type="empty" />
        ) : (
          <>
            <div className={styles.filterRow}>
              <SegmentedControl
                label="Category"
                options={categories.map((value) => ({
                  value,
                  label: formatCategoryLabel(value),
                }))}
                value={selectedCategory}
                onChange={(value) => {
                  setCategory(value);
                  setSearchParams(
                    (current) => {
                      const next = new URLSearchParams(current);
                      next.set("category", value);
                      return next;
                    },
                    { replace: true },
                  );
                  setSessionType("");
                  setPage(1);
                }}
              />
              <span className={styles.filterDot} aria-hidden="true" />
              <SegmentedControl
                label="Session"
                options={sessionTypes.map((value) => ({
                  value,
                  label: sessionLabel(value),
                  tooltip: sessionFullLabel(value),
                }))}
                value={selectedSessionType}
                onChange={(value) => {
                  setSessionType(value);
                  setPage(1);
                }}
              />
            </div>

            <SummaryBanner loading={resultsQuery.isFetching}>
              {`${formatCategoryLabel(selectedCategory)} · ${results?.session.completedRidersCount ?? "--"} Finishes · ${results ? (timeView === "splits" ? results.session.splitCount : results.session.sectorCount) : "--"} ${timeView === "splits" ? "Splits" : "Sectors"} · ${round.conditionName ?? "Condition unknown"}`}
            </SummaryBanner>

            <Podium data={podiumQuery.data} />

            <section
              className={styles.leaderboard}
              aria-labelledby="round-leaderboard-title"
            >
              <header className={styles.leaderboardHeader}>
                <div>
                  <h2 id="round-leaderboard-title">Leaderboard</h2>
                  <p>Rider positions and performance overview</p>
                </div>
                <SegmentedControl
                  label="Timing view"
                  options={[
                    { value: "sectors", label: "Sectors" },
                    { value: "splits", label: "Splits" },
                  ]}
                  value={timeView}
                  onChange={(value) => {
                    setTimeView(value);
                    setPage(1);
                  }}
                />
              </header>

              {resultsQuery.isPending ? <LoadingState /> : null}
              {resultsQuery.isError ? (
                <ErrorState
                  message={resultsQuery.error.message}
                  onRetry={() => void resultsQuery.refetch()}
                />
              ) : null}
              {results ? (
                results.items.length === 0 ? (
                  <TableFeedbackState type="empty" />
                ) : (
                  <SessionResultsTable
                    data={results}
                    category={selectedCategory}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSort={updateSort}
                    loading={resultsQuery.isFetching && !resultsQuery.isPending}
                    embedded
                  />
                )
              ) : null}
            </section>

            {results && results.items.length > 0 ? (
              <Pagination
                page={results.page}
                totalPages={results.totalPages}
                pageSize={results.pageSize}
                onPageChange={setPage}
              />
            ) : null}
          </>
        )
      ) : null}
    </PageContainer>
  );
}
