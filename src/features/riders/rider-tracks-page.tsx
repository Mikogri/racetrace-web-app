import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { SortableTableHeader } from "../../components/data-display/data-table";
import { CyclingText } from "../../components/data-display/cycling-text";
import { PerformanceValue } from "../../components/data-display/performance-value";
import { RatingValue } from "../../components/data-display/rating-value";
import { formatOneDecimal } from "../../utils/formatters";
import { RiderTableContent } from "./components/rider-table-content";
import { Pagination } from "../../components/navigation/pagination";
import { AppTooltip } from "../../components/overlays/tooltip";
import { useClientTable } from "../../hooks/use-client-table";
import type { RiderOutletContext } from "./rider-route-layout";
import styles from "./rider-pages.module.css";

type TrackSort =
  | "track"
  | "venue"
  | "rating"
  | "pace"
  | "consistency"
  | "preFinal"
  | "final"
  | "confidence";
type OverviewTrackRow =
  RiderOutletContext["overview"]["trackStatistics"][number];
type TrackRow = OverviewTrackRow & { averagePreFinalPosition: number | null };

const accessors = {
  track: (row: TrackRow) => row.trackName,
  venue: (row: TrackRow) =>
    `${row.venueName ?? ""} ${row.countryCode ?? ""}`,
  rating: (row: TrackRow) => row.rating,
  pace: (row: TrackRow) => row.pace,
  consistency: (row: TrackRow) => row.consistency,
  preFinal: (row: TrackRow) => row.averagePreFinalPosition,
  final: (row: TrackRow) => row.averageFinalPosition,
  confidence: (row: TrackRow) => row.confidence,
} satisfies Record<
  TrackSort,
  (row: TrackRow) => string | number | null | undefined
>;

export default function RiderTracksPage() {
  const { overview, isUpdating, hasDataError, retryData } =
    useOutletContext<RiderOutletContext>();
  const rows = useMemo(() => overview.trackStatistics.map((row): TrackRow => ({
    ...row,
    averagePreFinalPosition: overview.chartStatistics.preFinalAverageByTrack[row.trackId] ?? null,
  })), [overview.trackStatistics, overview.chartStatistics]);
  const table = useClientTable<TrackRow, TrackSort>(
    rows,
    accessors,
    "track",
    "desc",
    15,
  );
  return (
    <RiderTableContent hasDataError={hasDataError} isEmpty={rows.length === 0} onRetry={retryData}>
      <div className={styles.riderResultsScroll} tabIndex={0}>
        <table
          className={`${styles.riderResultsTable} ${styles.riderTracksTable}`}
        >
          <thead>
          <tr>
            <th aria-label="Index" />
            <SortableTableHeader
              label="Track"
              sortKey="track"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
            <SortableTableHeader
              label="Venue"
              sortKey="venue"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
            <SortableTableHeader
              label="Rating"
              sortKey="rating"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
            <SortableTableHeader
              label="Pace"
              sortKey="pace"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
            <SortableTableHeader
              label="Consistency"
              sortKey="consistency"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
            <SortableTableHeader
              label="Confidence"
              sortKey="confidence"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
            <SortableTableHeader
              label="Pre-Final avg."
              sortKey="preFinal"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
            <SortableTableHeader
              label="Final avg."
              sortKey="final"
              activeSort={table.sortBy}
              direction={table.sortDirection}
              onSort={table.updateSort}
            />
          </tr>
          </thead>
          <tbody>
          {table.items.map((row, index) => (
            <tr className={styles.riderResultRow} key={row.trackId}>
              <td>{(table.page - 1) * table.pageSize + index + 1}</td>
              <td>
                <AppTooltip content={row.trackName ?? "--"}>
                  <span className={styles.resultPrimaryText}>
                    {isUpdating ? <CyclingText value={row.trackName ?? "--"} /> : row.trackName ?? "--"}
                  </span>
                </AppTooltip>
              </td>
              <td>
                <AppTooltip content={`${row.venueName ?? "--"}, ${row.countryCode ?? "--"}`}>
                  <span className={styles.resultPrimaryText}>
                    {isUpdating ? (
                      <CyclingText value={`${row.venueName ?? "--"}, ${row.countryCode ?? "--"}`} />
                    ) : (
                      <>{row.venueName ?? "--"}, {row.countryCode ?? "--"}</>
                    )}
                  </span>
                </AppTooltip>
              </td>
              <td>
                <RatingValue value={row.rating} animate={isUpdating} animationLoop />
              </td>
              <td>
                <PerformanceValue value={row.pace} animate={isUpdating} animationLoop />
              </td>
              <td>
                <PerformanceValue value={row.consistency} animate={isUpdating} animationLoop />
              </td>
              <td>
                <PerformanceValue value={row.confidence} percent animate={isUpdating} animationLoop />
              </td>
              <td>
                {isUpdating ? (
                  <CyclingText value={row.averagePreFinalPosition == null ? "--" : formatOneDecimal(row.averagePreFinalPosition)} />
                ) : row.averagePreFinalPosition == null ? "--" : formatOneDecimal(row.averagePreFinalPosition)}
              </td>
              <td>
                {isUpdating ? (
                  <CyclingText value={row.averageFinalPosition == null ? "--" : formatOneDecimal(row.averageFinalPosition)} />
                ) : row.averageFinalPosition == null ? "--" : formatOneDecimal(row.averageFinalPosition)}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={table.page}
        totalPages={table.totalPages}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
      />
    </RiderTableContent>
  );
}
