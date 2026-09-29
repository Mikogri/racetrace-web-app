import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRequiredRouteParam } from "../../app/routes/use-required-route-param";
import { RouteLoadingPage } from "../../app/routes/route-states";
import type { SortDirection } from "../../components/data-display/data-table";
import { normalizeDisplayName } from "../../utils/display-name";
import { formatSessionLabel, useDomainMetadata } from "../../utils/domain-metadata";
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
  formatCategoryAbbreviation,
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
import { RoundAnalysis } from "./components/round-analysis";

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
  useDomainMetadata();
  const roundId = useRequiredRouteParam("roundId");
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "analyze" ? "analyze" : "results";
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
  const categories = sortCategoryValues(
    (sessionsQuery.data?.items ?? [])
      .map((item) => item.category)
      .filter((item): item is string => Boolean(item)),
  );
  if (categories.some((value) => value === "elite_men" || value === "junior_men")) categories.push("open_men");
  if (categories.some((value) => value === "elite_women" || value === "junior_women")) categories.push("open_women");
  const selectedCategory = categories.includes(category)
    ? category
    : (categories.find((item) => item === "elite_men") ?? categories[0] ?? "");
  const sessionTypes = [
      "all",
      ...new Set(
        [...(sessionsQuery.data?.items ?? [])
          .filter((item) => selectedCategory === "open_men"
            ? item.category === "elite_men" || item.category === "junior_men"
            : selectedCategory === "open_women" ? item.category === "elite_women" || item.category === "junior_women"
            : item.category === selectedCategory)
          .map((item) => item.sessionType)
          .filter((item): item is string => Boolean(item)), ...(sessionType && sessionType !== "all" ? [sessionType] : [])],
      ),
  ];
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
  }, tab === "results");
  const podiumQuery = useRoundResults({
    roundId,
    category: selectedCategory,
    sessionType: selectedSessionType,
    page: 1,
    timeView,
    sortBy: "finalTime",
    sortDirection: "desc",
  }, tab === "results");
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
    <PageContainer className={tab === "analyze" ? styles.analyticsPage : undefined}>
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
                label="Round view"
                value={tab}
                options={[{ value: "results", label: "Results" }, { value: "analyze", label: "Analytics" }]}
                onChange={(value) => setSearchParams((current) => {
                  const next = new URLSearchParams(current);
                  if (value === "results") next.delete("tab");
                  else next.set("tab", value);
                  return next;
                }, { replace: true, preventScrollReset: true })}
              />
              <span className={styles.filterDot} aria-hidden="true" />
              <SegmentedControl
                label="Category"
                options={categories.map((value) => ({
                  value,
                  label: value === "open_men" ? "OM" : value === "open_women" ? "OW" : formatCategoryAbbreviation(value),
                  tooltip: formatCategoryLabel(value),
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
                  setSessionType(selectedSessionType);
                  setPage(1);
                }}
              />
              <span className={styles.filterDot} aria-hidden="true" />
              <SegmentedControl
                label="Session"
                disabled={tab === "analyze"}
                options={sessionTypes.map((value) => ({
                  value,
                  label: value === "all" ? "All" : formatSessionLabel(value, "shortName"),
                  tooltip: value === "all" ? "Best completed run per rider across all sessions" : formatSessionLabel(value),
                }))}
                value={tab === "analyze" ? "all" : selectedSessionType}
                onChange={(value) => {
                  setSessionType(value);
                  setPage(1);
                }}
              />
            </div>

            {tab === "analyze" ? <RoundAnalysis roundId={roundId} season={round.season!} category={selectedCategory} onCategoryChange={setCategory} /> : <>
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
            </>}
          </>
        )
      ) : null}
    </PageContainer>
  );
}
