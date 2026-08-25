import { Fragment, useMemo } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { SortableTableHeader } from "../../components/data-display/data-table";
import { AnimatedNumber } from "../../components/data-display/animated-number";
import { CyclingText } from "../../components/data-display/cycling-text";
import { PerformanceValue } from "../../components/data-display/performance-value";
import { RatingValue } from "../../components/data-display/rating-value";
import { TableFeedbackState } from "../../components/feedback/states";
import { Pagination } from "../../components/navigation/pagination";
import { AppTooltip } from "../../components/overlays/tooltip";
import { getRiderNavigationState } from "../../components/navigation/rider-navigation-state";
import { routes } from "../../config/routes";
import { useClientTable } from "../../hooks/use-client-table";
import { formatCompetitionClassAbbreviation } from "../../utils/competition-classes";
import type { RiderSessionResult } from "./api/get-rider-sessions";
import type { RiderOutletContext } from "./rider-route-layout";
import styles from "./rider-pages.module.css";

type ResultSort =
  | "venue"
  | "date"
  | "class"
  | "rating"
  | "pace"
  | "consistency"
  | "preFinal"
  | "final";
type OverviewRow = RiderOutletContext["overview"]["roundResults"][number];
type ResultRow = OverviewRow & { sessions: RiderSessionResult[] };
type SessionEntry = { label: string; value: string };

const accessors = {
  venue: (row: ResultRow) => row.venueName ?? row.trackName,
  date: (row: ResultRow) => row.roundStartDate,
  class: (row: ResultRow) =>
    row.competitionClassName ?? row.competitionClassCode,
  rating: (row: ResultRow) => row.rating,
  pace: (row: ResultRow) => row.pace,
  consistency: (row: ResultRow) => row.consistency,
  preFinal: (row: ResultRow) =>
    bestPosition(row.sessions.filter((session) => !session.isFinal)),
  final: (row: ResultRow) =>
    bestPosition(row.sessions.filter((session) => session.isFinal)) ??
    row.finalPosition,
} satisfies Record<
  ResultSort,
  (row: ResultRow) => string | number | null | undefined
>;

function bestPosition(sessions: RiderSessionResult[]) {
  const positions = sessions
    .filter((session) => session.isClassified && session.position !== null)
    .map((session) => session.position as number);
  return positions.length > 0 ? Math.min(...positions) : null;
}

function formatSessionResult(result: RiderSessionResult | undefined) {
  if (!result) return "--";
  if (result.isClassified && result.position !== null)
    return String(result.position);
  if (result.status === "CANCELLED") return "C";
  return ["FINISHED", "MISSING"].includes(result.status) ? "--" : result.status;
}

function fallbackPreFinal(row: OverviewRow): SessionEntry[] {
  return [
    ["Q", row.qualifyingPosition],
    ["Q1", row.qualifying1Position],
    ["Q2", row.qualifying2Position],
    ["SF", row.semiFinalPosition],
  ]
    .filter((entry): entry is [string, number] => entry[1] !== null)
    .map(([label, position]) => ({ label, value: String(position) }));
}

function preFinalEntries(row: ResultRow): SessionEntry[] {
  const sessions = row.sessions
    .filter((session) => !session.isFinal)
    .sort(
      (left, right) =>
        left.sessionOrder - right.sessionOrder ||
        left.sessionId.localeCompare(right.sessionId, undefined, {
          numeric: true,
        }),
    );
  if (sessions.length === 0) return fallbackPreFinal(row);
  return sessions.map((session) => ({
    label: session.abbreviation,
    value: formatSessionResult(session),
  }));
}

function formatFinal(row: ResultRow) {
  const final = row.sessions.filter((session) => session.isFinal).at(-1);
  return final ? formatSessionResult(final) : (row.finalPosition ?? "--");
}

function formatResultDate(value: string | null) {
  if (!value) return "--";
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "--";
  return [
    String(date.getUTCDate()).padStart(2, "0"),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    date.getUTCFullYear(),
  ].join(".");
}

function classDetails(row: ResultRow) {
  const source =
    `${row.competitionClassCode ?? ""} ${row.competitionClassName ?? ""}`.toLowerCase();
  const label = formatCompetitionClassAbbreviation({
    abbreviation: row.competitionClassAbbreviation,
    code: row.competitionClassCode,
    name: row.competitionClassName,
  });
  if (source.includes("champ"))
    return { label, className: styles.worldChampionshipBadge };
  if (source.includes("cup") || source.includes("wc"))
    return { label, className: styles.worldCupBadge };
  return {
    label,
    className: styles.otherClassBadge,
  };
}

function SessionSequence({ entries, cycling = false }: { entries: SessionEntry[]; cycling?: boolean }) {
  if (entries.length === 0) return <span>--</span>;
  if (cycling)
    return <CyclingText value={entries.map((entry) => `${entry.label}: ${entry.value}`).join(" → ")} />;
  return (
    <span className={styles.sessionSequence}>
      {entries.map((entry, index) => (
        <Fragment key={`${entry.label}-${index}`}>
          <span className={styles.sessionEntry}>
            <span>{entry.label}:</span>
            <strong>{entry.value}</strong>
          </span>
          {index < entries.length - 1 ? (
            <span className={styles.sessionArrow}>→</span>
          ) : null}
        </Fragment>
      ))}
    </span>
  );
}

export default function RiderResultsPage() {
  const { overview, sessionResults, isUpdating, hasDataError, retryData } =
    useOutletContext<RiderOutletContext>();
  const location = useLocation();
  const navigate = useNavigate();
  const existingNavigationState = getRiderNavigationState(location.state);
  const rows = useMemo(() => {
    const sessionsByRound = new Map<string, RiderSessionResult[]>();
    sessionResults.forEach((result) =>
      sessionsByRound.set(result.roundId, [
        ...(sessionsByRound.get(result.roundId) ?? []),
        result,
      ]),
    );
    return overview.roundResults.map((row) => ({
      ...row,
      sessions: sessionsByRound.get(row.roundId) ?? [],
    }));
  }, [overview.roundResults, sessionResults]);
  const table = useClientTable<ResultRow, ResultSort>(
    rows,
    accessors,
    "date",
    "desc",
    15,
    accessors.date,
    "desc",
  );

  const openRound = (row: ResultRow) => {
    const category =
      row.sessions.find((session) => session.category)?.category ??
      overview.statistics.currentCategory;
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    navigate(`${routes.round(row.roundId)}${query}`, {
      state: {
        returnTo: `${location.pathname}${location.search}${location.hash}`,
        sourceSection: existingNavigationState?.sourceSection ?? routes.ranking,
      },
    });
  };

  if (hasDataError)
    return (
      <div className={`${styles.content} ${styles.resultsPage}`}>
        <TableFeedbackState type="error" onRetry={retryData} animate={false} />
      </div>
    );
  if (rows.length === 0)
    return (
      <div className={`${styles.content} ${styles.resultsPage}`}>
        <TableFeedbackState type="empty" animate={false} />
      </div>
    );

  return (
    <div className={`${styles.content} ${styles.resultsPage}`}>
      <div className={styles.riderResultsScroll} tabIndex={0}>
        <table className={styles.riderResultsTable}>
          <thead>
            <tr>
              <th aria-label="Index" />
              <SortableTableHeader
                label="Venue"
                sortKey="venue"
                activeSort={table.sortBy}
                direction={table.sortDirection}
                onSort={table.updateSort}
              />
              <SortableTableHeader
                label="Date"
                sortKey="date"
                activeSort={table.sortBy}
                direction={table.sortDirection}
                onSort={table.updateSort}
              />
              <SortableTableHeader
                label="Class"
                sortKey="class"
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
                label="Pre-Final"
                sortKey="preFinal"
                activeSort={table.sortBy}
                direction={table.sortDirection}
                onSort={table.updateSort}
              />
              <SortableTableHeader
                label="Finals"
                sortKey="final"
                activeSort={table.sortBy}
                direction={table.sortDirection}
                onSort={table.updateSort}
              />
            </tr>
          </thead>
          <tbody>
            {table.items.map((row, index) => {
              const eventClass = classDetails(row);
              return (
                <tr
                  className={styles.riderResultRow}
                  key={row.roundId}
                  tabIndex={0}
                  role="link"
                  onClick={() => openRound(row)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openRound(row);
                    }
                  }}
                >
                  <td>
                    {isUpdating ? (
                      <AnimatedNumber value={(table.page - 1) * table.pageSize + index + 1} duration={400} loop />
                    ) : (
                      (table.page - 1) * table.pageSize + index + 1
                    )}
                  </td>
                  <td>
                    <AppTooltip content={`${row.venueName ?? row.trackName ?? "--"} (${row.countryCode ?? "---"})`}>
                      <span className={styles.resultPrimaryText}>
                        {isUpdating ? (
                          <CyclingText value={`${row.venueName ?? row.trackName ?? "--"} (${row.countryCode?.toUpperCase() ?? "---"})`} />
                        ) : (
                          <>{row.venueName ?? row.trackName ?? "--"}{" "}<span className={styles.resultCountryCode}>({row.countryCode?.toUpperCase() ?? "---"})</span></>
                        )}
                      </span>
                    </AppTooltip>
                  </td>
                  <td>{isUpdating ? <CyclingText value={formatResultDate(row.roundStartDate)} /> : formatResultDate(row.roundStartDate)}</td>
                  <td>
                    <span
                      className={`${styles.resultClassBadge} ${eventClass.className}`}
                    >
                      {isUpdating ? <CyclingText value={eventClass.label} /> : eventClass.label}
                    </span>
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
                    <SessionSequence entries={preFinalEntries(row)} cycling={isUpdating} />
                  </td>
                  <td>{isUpdating ? <CyclingText value={String(formatFinal(row))} /> : formatFinal(row)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        page={table.page}
        totalPages={table.totalPages}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
      />
    </div>
  );
}
