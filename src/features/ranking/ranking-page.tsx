import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatedNumber } from "../../components/data-display/animated-number";
import {
  DataTable,
  DataTableHeader,
  RiderTableRow,
  SortableTableHeader,
  type SortDirection,
} from "../../components/data-display/data-table";
import { PerformanceValue } from "../../components/data-display/performance-value";
import { RatingValue } from "../../components/data-display/rating-value";
import { RequestDetails } from "../../components/data-display/request-details";
import { RiderCell } from "../../components/data-display/rider-cell";
import { ContextFilters } from "../../components/filters/context-filters";
import { useContextFilterOptions } from "../../components/filters/api/get-filter-options";
import { TableFeedbackState } from "../../components/feedback/states";
import { SearchInput } from "../../components/forms/search-input";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { Pagination } from "../../components/navigation/pagination";
import { SegmentedControl } from "../../components/navigation/segmented-control";
import { SummaryBanner } from "../../components/ui/panel";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { useMetricsFilters } from "../../hooks/use-metrics-filters";
import type { MetricsFilters, RiderSummary } from "../../types/domain";
import { formatCategoryLabel } from "../../utils/categories";
import {
  useRanking,
  type RankingSort,
} from "./api/get-ranking";
import styles from "./ranking-page.module.css";
import { UpdateProgress } from "../../components/feedback/update-progress";

const SHOW_RANKING_REQUEST_DETAILS = true;

const rankingSorts: RankingSort[] = [
  "position",
  "fullName",
  "totalPoints",
  "rating",
  "pace",
  "consistency",
  "confidence",
  "qualifyingRate",
  "finalsCount",
];

function rankingFilterSignature(filters: MetricsFilters) {
  return JSON.stringify({
    seasons: filters.seasons,
    tracks: filters.tracks,
    conditions: filters.conditions,
    classes: filters.classes,
    categories: filters.categories,
  });
}

function roundedChange(value: number) {
  return Math.round(value * 100) / 100;
}

function ChangeIndicator({ value }: { value: number | null }) {
  if (value === null) return null;
  const normalized = roundedChange(value);
  const direction = normalized > 0 ? "up" : normalized < 0 ? "down" : "same";
  const label = Math.abs(normalized).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
  return (
    <span
      className={styles.changeIndicator}
      data-direction={direction}
      aria-label={direction === "same" ? "No position change" : undefined}
    >
      {direction !== "same" ? (
        <span className={styles.changeArrow} aria-hidden="true" />
      ) : (
        <span className={styles.noChangeIcon} aria-hidden="true" />
      )}
      {direction !== "same" ? <span>{label}</span> : null}
    </span>
  );
}

function ValueWithChange({
  children,
  change,
}: {
  children: ReactNode;
  change: number | null;
}) {
  return (
    <span className={styles.valueWithChange}>
      {children}
      <ChangeIndicator value={change} />
    </span>
  );
}

export default function RankingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useMetricsFilters();
  const filterOptions = useContextFilterOptions();
  const appliedFilters = useMemo(() => {
    const allClassesSelected =
      filterOptions.options.classes.length > 0 &&
      filterOptions.options.classes.every((option) =>
        filters.classes.includes(option.value),
      );
    return allClassesSelected ? { ...filters, classes: [] } : filters;
  }, [filterOptions.options.classes, filters]);
  const search = searchParams.get("search") ?? "";
  const debouncedSearch = useDebouncedValue(search, 300);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const defaultSort: RankingSort = "rating";
  const requestedSort = searchParams.get("sortBy");
  const sortBy = rankingSorts.includes(requestedSort as RankingSort)
    ? (requestedSort as RankingSort)
    : defaultSort;
  const requestedDirection = searchParams.get("sortDirection");
  const defaultDirection: SortDirection = "desc";
  const sortDirection: SortDirection =
    requestedDirection === "asc" || requestedDirection === "desc"
      ? requestedDirection
      : defaultDirection;
  const filterSignature = rankingFilterSignature(
    appliedFilters,
  );
  const hasNarrowingFilters =
    appliedFilters.tracks.length > 0 ||
    appliedFilters.conditions.length > 0 ||
    appliedFilters.classes.length > 0;
  const lastSettledFilters = useRef<{
    filters: MetricsFilters;
    search: string;
  } | null>(null);
  const [comparisonFilters, setComparisonFilters] = useState<{
    filters: MetricsFilters;
    search: string;
  } | null>(null);
  const activeFilterSignature = useRef(filterSignature);

  const comparison =
    sortBy === "fullName"
      ? undefined
      : comparisonFilters
        ? ("previousFilters" as const)
        : hasNarrowingFilters
          ? ("defaultFilters" as const)
          : ("previousRound" as const);
  const rankingQuery = useRanking({
    filters: appliedFilters,
    search: debouncedSearch,
    page,
    sortBy,
    sortDirection,
    ...(comparison ? { comparison } : {}),
    ...(comparison === "previousFilters" && comparisonFilters
      ? { comparisonFilters }
      : {}),
  });
  const rankingData = rankingQuery.data;

  useEffect(() => {
    if (activeFilterSignature.current === filterSignature) return;
    setComparisonFilters(lastSettledFilters.current);
    activeFilterSignature.current = filterSignature;
  }, [filterSignature]);

  useEffect(() => {
    if (!rankingQuery.isSuccess || rankingQuery.isFetching || !rankingData) {
      return;
    }
    lastSettledFilters.current = {
      filters: appliedFilters,
      search: debouncedSearch,
    };
  }, [
    appliedFilters,
    debouncedSearch,
    rankingData,
    rankingQuery.dataUpdatedAt,
    rankingQuery.isFetching,
    rankingQuery.isSuccess,
  ]);
  const rankingError = rankingQuery.isError;
  const showInitialLoading = rankingQuery.isPending && !rankingData;
  const rankingUpdating = !showInitialLoading && rankingQuery.isFetching;
  const hasRankingRows = Boolean(rankingData && rankingData.items.length > 0);
  const displayRankingError = !hasRankingRows && rankingError;
  const feedbackUpdating = rankingUpdating && !hasRankingRows;
  const categoryLabel = formatCategoryLabel(
    filters.categories[0] ?? "elite_men",
  );
  const showFullPageFeedback = showInitialLoading || displayRankingError;
  const summaryContent =
    rankingData && rankingData.items.length > 0
      ? `${categoryLabel} · ${rankingData.summary.sessionsCount} Sessions · ${rankingData.summary.finalsCount} Finals · ${rankingData.summary.ridersCount} Riders`
      : `${categoryLabel} · -- Sessions · -- Finals · -- Riders`;

  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  const updateRankingFilters = (nextFilters: MetricsFilters) => {
    const contextChanged =
      JSON.stringify({
        seasons: filters.seasons,
        categories: filters.categories,
      }) !==
      JSON.stringify({
        seasons: nextFilters.seasons,
        categories: nextFilters.categories,
      });
    setComparisonFilters(
      contextChanged
        ? null
        : lastSettledFilters.current ?? {
            filters: appliedFilters,
            search: debouncedSearch,
          },
    );
    setFilters(nextFilters);
  };

  const updateSearch = (value: string) => {
    updateParam("search", value);
  };

  const updateSort = (nextSort: RankingSort) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        const nextDirection: SortDirection =
          sortBy === nextSort && sortDirection === "desc" ? "asc" : "desc";
        next.set("sortBy", nextSort);
        next.set("sortDirection", nextDirection);
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  const retryRanking = () => rankingQuery.refetch();

  return (
    <PageContainer
      className={showFullPageFeedback ? styles.feedbackPage : undefined}
    >
      <PageHeader
        title="Ranking"
        eyebrow="Performance // Standings // Categories"
        description="See how riders compare across the selected season or date range, including their results, performance and key race statistics."
      />
      <Section>
        <div className={styles.filterRow}>
          <div className={styles.filterControls}>
            <SegmentedControl
              label="Category"
              options={filterOptions.options.categories}
              value={filters.categories[0] ?? "elite_men"}
              onChange={(category) =>
                updateRankingFilters({ ...filters, categories: [category] })
              }
            />
            <ContextFilters
              options={filterOptions.options}
              value={filters}
              onChange={updateRankingFilters}
              disabled={filterOptions.isPending}
              showCategories={false}
            />
          </div>
          <SearchInput
            value={search}
            placeholder="Search..."
            onChange={(event) => updateSearch(event.currentTarget.value)}
          />
        </div>
        <SummaryBanner loading={rankingQuery.isFetching}>
          {summaryContent}
        </SummaryBanner>
      </Section>
      <Section
        className={showFullPageFeedback ? styles.feedbackSection : undefined}
        aria-labelledby="leaderboard-title"
      >
        {SHOW_RANKING_REQUEST_DETAILS && rankingData ? (
          <div className={styles.requestControls}>
            <RequestDetails data={rankingData} />
            <button
              className={styles.clearCacheButton}
              type="button"
              disabled={rankingQuery.isFetching}
              onClick={() => void rankingQuery.clearCache()}
            >
              Clear cache
            </button>
          </div>
        ) : null}
        <div className={styles.transitionStage}>
          {showInitialLoading ? (
            <TableFeedbackState type="loading" />
          ) : displayRankingError ? (
            <div className={styles.feedbackTransition}>
              <TableFeedbackState
                type="error"
                onRetry={() => void retryRanking()}
              />
            </div>
          ) : (
            <div
              className={`${styles.tableFrame} ${hasRankingRows ? styles.leaderboardEnter : ""} ${feedbackUpdating ? styles.feedbackRefreshing : ""}`}
            >
              <header className={styles.tableHeader}>
                <h2 id="leaderboard-title" className={styles.tableTitle}>
                  Leaderboard
                </h2>
                <p className={styles.tableDescription}>
                  Rider positions and performance overview
                </p>
              </header>
              {feedbackUpdating && !displayRankingError ? (
                <UpdateProgress
                  className={styles.feedbackProgress}
                  label="Loading ranking data"
                />
              ) : null}
              {rankingData && rankingData.items.length === 0 ? (
                <TableFeedbackState type="empty" />
              ) : null}
              {rankingData && rankingData.items.length > 0 ? (
                <div className={styles.scanArea}>
                  <DataTable
                    className={styles.rankingTable}
                    embedded
                    loading={rankingUpdating}
                  >
                    <DataTableHeader>
                      <tr>
                        <SortableTableHeader
                          label=""
                          ariaLabel="Position"
                          sortKey="position"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Rider"
                          column="rider"
                          sortKey="fullName"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Points"
                          sortKey="totalPoints"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Rating"
                          sortKey="rating"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Pace"
                          sortKey="pace"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Consistency"
                          sortKey="consistency"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Confidence"
                          sortKey="confidence"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Qualified"
                          sortKey="qualifyingRate"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                        <SortableTableHeader
                          label="Finals"
                          sortKey="finalsCount"
                          activeSort={sortBy}
                          direction={sortDirection}
                          onSort={updateSort}
                        />
                      </tr>
                    </DataTableHeader>
                    <tbody>
                      {rankingData.items.map((row) => {
                        const visiblePositionChange =
                          rankingUpdating || sortBy === "fullName"
                            ? null
                            : row.positionChange;
                        const rider: RiderSummary = {
                          id: row.riderId,
                          name: row.fullName,
                          team: row.teamName,
                          country: row.countryCode,
                          category: null,
                          profileImageUrl: row.profileImageUrl,
                        };
                        return (
                          <RiderTableRow
                            key={row.riderId}
                            riderId={row.riderId}
                          >
                            <td>
                              <ValueWithChange
                                change={visiblePositionChange}
                              >
                              {rankingUpdating ? (
                                <AnimatedNumber
                                  value={row.position}
                                  duration={400}
                                  loop
                                />
                              ) : (
                                row.position
                              )}
                              </ValueWithChange>
                            </td>
                            <td data-column="rider">
                              <RiderCell
                                rider={rider}
                                compact
                                cycling={rankingUpdating}
                              />
                            </td>
                            <td>
                              <span className={styles.points}>
                                {rankingUpdating ? (
                                  <AnimatedNumber
                                    value={row.totalPoints}
                                    duration={600}
                                    loop
                                  />
                                ) : (
                                  row.totalPoints
                                )}
                              </span>
                            </td>
                            <td>
                              <RatingValue
                                value={row.rating}
                                animate={rankingUpdating}
                                animationLoop
                                animationDuration={470}
                              />
                            </td>
                            <td>
                              <PerformanceValue
                                value={row.pace}
                                animate={rankingUpdating}
                                animationLoop
                                animationDuration={450}
                              />
                            </td>
                            <td>
                              <PerformanceValue
                                value={row.consistency}
                                animate={rankingUpdating}
                                animationLoop
                                animationDuration={460}
                              />
                            </td>
                            <td>
                              <PerformanceValue
                                value={row.confidence}
                                percent
                                animate={rankingUpdating}
                                animationLoop
                                animationDuration={440}
                              />
                            </td>
                            <td>
                              <PerformanceValue
                                value={row.qualifyingRate * 100}
                                percent
                                animate={rankingUpdating}
                                animationLoop
                                animationDuration={430}
                              />
                            </td>
                            <td>
                              {rankingUpdating ? (
                                <AnimatedNumber
                                  value={row.finalsCount}
                                  duration={400}
                                  loop
                                />
                              ) : (
                                row.finalsCount
                              )}
                            </td>
                          </RiderTableRow>
                        );
                      })}
                    </tbody>
                  </DataTable>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {!rankingError && rankingData && rankingData.items.length > 0 ? (
          <Pagination
            page={rankingData.page}
            totalPages={rankingData.totalPages}
            pageSize={rankingData.pageSize}
            onPageChange={(nextPage) => updateParam("page", String(nextPage))}
          />
        ) : null}
      </Section>
    </PageContainer>
  );
}
