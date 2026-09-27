import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRequiredRouteParam } from "../../app/routes/use-required-route-param";
import type { SortDirection } from "../../components/data-display/data-table";
import { TableFeedbackState } from "../../components/feedback/states";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { BackButton } from "../../components/navigation/back-button";
import { Panel, SummaryBanner } from "../../components/ui/panel";
import { SegmentedControl } from "../../components/navigation/segmented-control";
import { routes } from "../../config/routes";
import { formatCategoryLabel } from "../../utils/categories";
import { formatLiveSessionLabel, useDomainMetadata } from "../../utils/domain-metadata";
import { formatCountryName } from "../../utils/countries";
import {
  SessionResultsTable,
  type ResultSort,
} from "../results/components/session-results-table";
import {
  useChronoRaceSessionResults,
  useChronoRaceCatalog,
  useLiveRound,
  useResolvedLiveRiderIds,
} from "./api/get-live";
import { LiveCourseChart } from "./components/live-course-chart";
import styles from "./live-results-page.module.css";

export default function LiveResultsPage() {
  useDomainMetadata();
  const sessionId = useRequiredRouteParam("sessionId");
  const [searchParams] = useSearchParams();
  const requestedSeason = Number(searchParams.get("season"));
  const season = Number.isInteger(requestedSeason) && requestedSeason > 0
    ? requestedSeason
    : new Date().getUTCFullYear();
  const roundId = searchParams.get("roundId");
  const [sortBy, setSortBy] = useState<ResultSort>("finalTime");
  const [timeView, setTimeView] = useState<"sectors" | "splits">("sectors");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");
  const roundQuery = useLiveRound({ season, roundId });
  const catalogQuery = useChronoRaceCatalog(roundQuery.data);
  const session = catalogQuery.data?.find((item) => item.id === sessionId);
  const resultsQuery = useChronoRaceSessionResults(session);
  const results = resultsQuery.data?.results;
  const uciIds = useMemo(
    () => results?.items.flatMap((item) => item.uciId ? [item.uciId] : []) ?? [],
    [results],
  );
  const riderIdsQuery = useResolvedLiveRiderIds(uciIds);
  const hasTeams = results?.items.some((item) => !item.isPerfectRun && Boolean(item.teamName?.trim()));
  const displayResults = useMemo(
    () => results ? {
      ...results,
      items: results.items.map((item) => ({
        ...item,
        riderId: item.uciId ? (riderIdsQuery.data?.get(item.uciId) ?? null) : null,
        countryCode: null,
        teamId: null,
        teamName: hasTeams ? item.teamName?.trim() || null : formatCountryName(item.countryCode),
      })),
    } : undefined,
    [results, riderIdsQuery.data, hasTeams],
  );
  const updateSort = (nextSort: ResultSort) => {
    setSortDirection((current) =>
      sortBy === nextSort && current === "desc" ? "asc" : "desc",
    );
    setSortBy(nextSort);
  };

  const retry = () => {
    void roundQuery.refetch();
    void catalogQuery.refetch();
    if (session) void resultsQuery.refetch();
  };
  const initialLoading =
    roundQuery.isPending || catalogQuery.isPending ||
    (Boolean(session) && resultsQuery.isPending);
  const error =
    (!roundQuery.data ? roundQuery.error : null) ??
    (!catalogQuery.data ? catalogQuery.error : null) ??
    (!results ? resultsQuery.error : null);
  return (
    <PageContainer>
      <div className={styles.pageHeaderStack}>
        <BackButton fallback={routes.live} />
        <PageHeader
          title={roundQuery.data?.venueName ?? "Live Timing"}
          eyebrow={[
            session?.season ? `${session.season} Season` : "---- Season",
            session?.competitionName ?? "Competition",
            session?.roundNumber ? `Round ${session.roundNumber}` : "Round --",
          ].join(" / ")}
          description="Live sector performance, time gaps and leaderboard changes direct from race timing."
        />
      </div>

      <Section>
        {initialLoading ? <TableFeedbackState type="loading" /> : null}
        {error ? (
          <TableFeedbackState type="error" onRetry={retry} />
        ) : null}
        {!initialLoading && !error && !session ? (
          <TableFeedbackState
            type="empty"
            label="No data available"
            description="There is no data available for this session."
          />
        ) : null}

        {session && results ? (
          <div className={styles.loadedContent}>
            <SummaryBanner>
              {`${formatCategoryLabel(session.category)} · ${formatLiveSessionLabel(session)} · ${resultsQuery.data?.summary.finished ?? "--"} Finished · ${resultsQuery.data?.summary.onTrack ?? "--"} On track · ${resultsQuery.data?.summary.toStart ?? "--"} To start`}
            </SummaryBanner>

            <LiveCourseChart
              riders={resultsQuery.data?.riders ?? []}
              riderIds={riderIdsQuery.data}
            />

            {displayResults && displayResults.items.length === 0 ? (
                <TableFeedbackState
                  type="empty"
                  label="No data available"
                  description="There is no data available for this session."
              />
            ) : (
              <Panel padding="none" className={styles.leaderboard}>
                <header className={styles.leaderboardHeader}>
                  <div className={styles.leaderboardCopy}>
                    <h2>Leaderboard</h2>
                    <p>Rider positions and performance overview</p>
                  </div>
                  <SegmentedControl label="Timing view" value={timeView} onChange={setTimeView} options={[{ value: "sectors", label: "Sectors" }, { value: "splits", label: "Splits" }]} />
                </header>
              <SessionResultsTable
                data={displayResults ?? results}
                category={session.category}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={updateSort}
                loading={false}
                liveGrouping
                timeView={timeView}
                embedded
              />
              </Panel>
            )}
          </div>
        ) : null}
      </Section>
    </PageContainer>
  );
}
