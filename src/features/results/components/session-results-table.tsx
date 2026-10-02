import { Fragment, useEffect, useState } from "react";
import {
  DataTable,
  DataTableHeader,
  RiderTableRow,
  SortableTableHeader,
  type SortDirection,
} from "../../../components/data-display/data-table";
import { RiderCell } from "../../../components/data-display/rider-cell";
import { CyclingText } from "../../../components/data-display/cycling-text";
import type { RiderSummary } from "../../../types/domain";
import { formatGap, formatRaceTime } from "../../../utils/formatters";
import { formatSessionLabel } from "../../../utils/domain-metadata";
import type { SessionResults } from "../../live/api/get-live";
import styles from "./session-results-table.module.css";

export type ResultSort = "finalTime" | `time:${number}`;

function LoadingText({ value, loading }: { value: string; loading: boolean }) {
  return loading ? <CyclingText value={value} /> : value;
}

function sectionTime(time: number | null) {
  return formatRaceTime(time).replace(/^0:/, "");
}

function bestSectorTime(time: number | null, fractionDigits: number) {
  if (time === null || !Number.isFinite(time)) return "--";
  const minutes = Math.floor(time / 60);
  const displayedFractionDigits = minutes > 0 ? 2 : fractionDigits;
  const seconds = (time - minutes * 60)
    .toFixed(displayedFractionDigits)
    .padStart(3 + displayedFractionDigits, "0");
  return minutes > 0 ? `${minutes}:${seconds}` : seconds;
}

function sectorGap(gap: number | null) {
  if (gap === null || !Number.isFinite(gap)) return "--";
  const absoluteGap = Math.abs(gap);
  const fractionDigits = absoluteGap < 10 ? 3 : absoluteGap < 100 ? 2 : 1;
  return `${gap > 0 ? "+" : "−"}${absoluteGap.toFixed(fractionDigits)}`;
}

function SectorValue({
  time,
  gap,
  showTime,
  bestTimeFractionDigits,
  loading,
}: {
  time: number | null;
  gap: number | null;
  showTime: boolean;
  bestTimeFractionDigits: number;
  loading: boolean;
}) {
  const value = showTime
    ? bestSectorTime(time, bestTimeFractionDigits)
    : sectorGap(gap);
  const tone =
    gap === null
      ? styles.sectorMissing
      : gap <= 0
        ? styles.sectorBest
        : styles.sectorSlower;

  return (
    <span className={`${styles.sectorValue} ${tone}`}>
      <LoadingText value={value} loading={loading} />
    </span>
  );
}

function TimeWithGap({
  time,
  gap,
  gapFractionDigits = 2,
  isFastest = false,
  compactTime = false,
  winner = false,
  winnerLabel = "Winner",
  loading = false,
}: {
  time: number | null;
  gap: number | null;
  gapFractionDigits?: number;
  isFastest?: boolean;
  compactTime?: boolean;
  winner?: boolean;
  winnerLabel?: string;
  loading?: boolean;
}) {
  const gapLabel =
    gap === 0
      ? (0).toFixed(gapFractionDigits)
      : formatGap(gap, gapFractionDigits);
  const gapClass =
    gap === null || gap === 0
      ? undefined
      : gap < 0
        ? styles.gapAdvantage
        : styles.gapLoss;
  return (
    <div
      className={`${styles.timingValue} ${isFastest ? styles.fastestValue : ""}`}
    >
      <span>
        <LoadingText
          value={compactTime ? sectionTime(time) : formatRaceTime(time)}
          loading={loading}
        />
      </span>
      <small className={winner ? styles.winner : gapClass}>
        <LoadingText value={winner ? winnerLabel : gapLabel} loading={loading} />
      </small>
    </div>
  );
}

function LiveRunClock({ startedAt, gap }: { startedAt: number | undefined; gap: number | null }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (startedAt === undefined) return;
    const timer = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(timer);
  }, [startedAt]);
  return <span className={gap === null || Math.abs(gap) < 0.0005 ? undefined : gap < 0 ? styles.gapAdvantage : styles.gapLoss}>{startedAt === undefined ? "--" : formatRaceTime(Math.max(0, (now - startedAt) / 1000))}</span>;
}

function RunTime({
  time,
  gap,
  status,
  startTime,
  liveStartedAt,
  loading,
  winner,
  winnerLabel,
}: {
  time: number | null;
  gap: number | null;
  status: string | null;
  startTime?: string | null | undefined;
  liveStartedAt?: number | undefined;
  loading: boolean;
  winner: boolean;
  winnerLabel: string;
}) {
  const normalizedStatus = status?.trim().toUpperCase();
  if (normalizedStatus && ["ON TRACK", "LIVE", "RUNNING"].includes(normalizedStatus)) {
    return <LiveRunClock startedAt={liveStartedAt} gap={gap} />;
  }
  if (normalizedStatus && ["UPCOMING", "SCHEDULED", "TO START"].includes(normalizedStatus)) {
    return <LoadingText value={startTime ?? "--"} loading={loading} />;
  }
  if (normalizedStatus && ["DNS", "DNF", "DSQ"].includes(normalizedStatus)) {
    return (
      <strong className={styles.invalidResult}>
        <LoadingText value={normalizedStatus} loading={loading} />
      </strong>
    );
  }
  return (
    <TimeWithGap
      time={time}
      gap={gap}
      gapFractionDigits={3}
      winner={winner}
      winnerLabel={winnerLabel}
      loading={loading}
    />
  );
}

export function SessionResultsTable({
  data: sourceData,
  category,
  sortBy,
  sortDirection,
  onSort,
  loading = false,
  embedded = false,
  liveGrouping = false,
  timeView,
}: {
  data: SessionResults;
  category: string | null;
  sortBy: ResultSort;
  sortDirection: SortDirection;
  onSort: (sort: ResultSort) => void;
  loading?: boolean;
  embedded?: boolean;
  liveGrouping?: boolean;
  timeView?: "sectors" | "splits";
}) {
  let data = sourceData;
  const sourceItems = data.items;
  const showSession = !liveGrouping && (data.session.sessionType?.toLowerCase() === "all" || sourceItems.some((row) => row.sessionType));
  if (liveGrouping && timeView === "splits" && data.session.timeView === "sectors") {
    const items = sourceItems.map((row) => {
      let total = 0;
      let previousIndex = 0;
      return { ...row, times: row.times.filter((timing) => timing.index <= data.session.splitCount).map((timing) => {
        total = timing.time === null || timing.index !== previousIndex + 1 ? NaN : total + timing.time;
        previousIndex = timing.index;
        return { ...timing, time: Number.isFinite(total) ? total : null };
      }) };
    });
    for (const row of items) for (const timing of row.times) {
      const values = items.filter((item) => !item.isPerfectRun).flatMap((item) => {
        const value = item.times.find((entry) => entry.index === timing.index)?.time;
        return value == null ? [] : [value];
      });
      timing.position = timing.time === null ? null : 1 + values.filter((value) => value < timing.time!).length;
      timing.gapToBest = timing.time === null || !values.length ? null : timing.time - Math.min(...values);
    }
    data = { ...data, items };
  }
  const [initialReveal, setInitialReveal] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setInitialReveal(false), 280);
    return () => window.clearTimeout(timeout);
  }, []);

  const sectorIndexes = liveGrouping && timeView !== "splits" ? [1, 2, 3, 4, 5] : [
    ...new Set(
      data.items.flatMap((row) => row.times.map((time) => time.index)),
    ),
  ].sort((a, b) => a - b);
  const splitSortIndex = sortBy.startsWith("time:")
    ? Number(sortBy.slice(5))
    : null;
  const liveGroup = (row: SessionResults["items"][number]) => {
    const status = row.status?.trim().toLowerCase().replaceAll(/[_-]/g, " ") ?? "";
    if (row.isPerfectRun || row.finalTime !== null || /^(dns|dnf|dsq)$/.test(status)) {
      return "completed";
    }
    if (/on\s*track|live|running/.test(status) || row.times.length > 0) return "on-track";
    return "upcoming";
  };
  const orderedRows = [...data.items].sort((left, right) => {
    if (liveGrouping) {
      const ranks = { "on-track": 0, completed: 1, upcoming: 2 } as const;
      const groupOrder = ranks[liveGroup(left)] - ranks[liveGroup(right)];
      if (groupOrder !== 0) return groupOrder;
    }
    const perfectOrder = Number(right.isPerfectRun) - Number(left.isPerfectRun);
    if (perfectOrder !== 0) return perfectOrder;
    if (splitSortIndex === null || loading) return 0;
    const leftPosition =
      left.times.find((time) => time.index === splitSortIndex)?.position ??
      Number.POSITIVE_INFINITY;
    const rightPosition =
      right.times.find((time) => time.index === splitSortIndex)?.position ??
      Number.POSITIVE_INFINITY;
    if (leftPosition === rightPosition) return 0;
    return (leftPosition - rightPosition) * (sortDirection === "desc" ? 1 : -1);
  });
  const hasOnTrack = liveGrouping && data.items.some((row) => liveGroup(row) === "on-track");
  const sessionLeader = data.items.find((row) => {
    const status = row.status?.trim().toUpperCase();
    return (
      !row.isPerfectRun &&
      row.finalGapToBest === 0 &&
      !["DNS", "DNF", "DSQ"].includes(status ?? "")
    );
  });
  const leaderTimes = new Map(
    sessionLeader?.times.map((time) => [time.index, time.time]) ?? [],
  );
  return (
    <DataTable
      className={`${styles.resultsTable} ${!loading && initialReveal ? styles.resultsEnter : ""}`}
      loading={loading}
      embedded={embedded}
    >
      <DataTableHeader>
        <tr>
          <th scope="col" aria-label="Position" />
          <th scope="col" data-column="rider">
            Rider
          </th>
          {showSession && <th scope="col">Session</th>}
          {sectorIndexes.map((index) => (
            <SortableTableHeader
              key={index}
              label={`S${index}`}
              sortKey={`time:${index}` as const}
              activeSort={sortBy}
              direction={sortDirection}
              onSort={onSort}
            />
          ))}
          <SortableTableHeader
            label="Time"
            sortKey="finalTime"
            activeSort={sortBy}
            direction={sortDirection}
            onSort={onSort}
          />
        </tr>
      </DataTableHeader>
      <tbody>
        {orderedRows.map((row, rowIndex) => {
          const isSessionWinner = row === sessionLeader;
          const rider: RiderSummary = {
            id: row.riderId ?? "",
            name: row.fullName,
            team: row.teamName,
            country: row.countryCode,
            category,
            profileImageUrl: null,
          };
          const times = new Map(row.times.map((time) => [time.index, time]));
          const group = liveGroup(row);
          const previousGroup = rowIndex > 0 ? liveGroup(orderedRows[rowIndex - 1]) : null;
          const showSeparator = liveGrouping && group !== previousGroup && (group === "upcoming" || hasOnTrack);
          const sourceRow = sourceItems.find((item) => item.resultId === row.resultId && item.fullName === row.fullName);
          const sourceLeader = sourceItems.find((item) => item === sessionLeader || (!item.isPerfectRun && item.finalGapToBest === 0 && item.finalTime !== null));
          const latestSplitGap = sourceRow?.times.length && sourceLeader
            ? sourceRow.times.reduce<number | null>((gap, timing) => {
                const leaderTiming = sourceLeader.times.find((item) => item.index === timing.index)?.time;
                if (gap === null || timing.time === null || leaderTiming == null) return null;
                return gap + timing.time - leaderTiming;
              }, 0)
            : null;
          const rowKey = row.isPerfectRun
            ? "perfect-run"
            : (row.resultId ?? `${row.fullName}-${row.position ?? "unclassified"}`);
          return (
            <Fragment key={rowKey}>
            {showSeparator ? (
              <tr className={styles.liveSeparatorRow}>
                <td colSpan={sectorIndexes.length + 3 + Number(showSession)}>
                  <span>{group === "on-track" ? "ON TRACK" : group === "completed" ? "RESULTS" : "UPCOMING"}</span>
                </td>
              </tr>
            ) : null}
            <RiderTableRow
              riderId={row.isPerfectRun ? null : row.riderId}
              className={row.isPerfectRun ? styles.perfectRunRow : undefined}
            >
              <td>
                {row.isPerfectRun ? (
                  <span
                    className={styles.perfectRunStar}
                    aria-label="Perfect Run"
                  >
                    ★
                  </span>
                ) : (
                  <LoadingText
                    value={row.position?.toString() ?? "--"}
                    loading={loading}
                  />
                )}
              </td>
              <td data-column="rider">
                {row.isPerfectRun ? (
                  <div className={styles.perfectRunIdentity}>
                    <strong>
                      <LoadingText value="Perfect Run" loading={loading} />
                    </strong>
                    <small>
                      <LoadingText
                        value="Best sector combination"
                        loading={loading}
                      />
                    </small>
                  </div>
                ) : (
                  <div>
                  <RiderCell
                    rider={rider}
                    compact
                    cycling={loading}
                    linked={row.riderId !== null}
                  />
                  </div>
                )}
              </td>
              {showSession && <td><LoadingText value={row.sessionType ? formatSessionLabel(row.sessionType, "shortName") : "--"} loading={loading} /></td>}
              {sectorIndexes.map((index) => {
                const timing = times.get(index);
                const leaderTime = leaderTimes.get(index);
                const calculatedGap =
                  timing?.time !== null &&
                  timing?.time !== undefined &&
                  leaderTime !== null &&
                  leaderTime !== undefined
                    ? timing.time - leaderTime
                    : (timing?.gapToBest ?? null);
                const comparisonGap =
                  calculatedGap !== null && Math.abs(calculatedGap) < 0.0005
                    ? 0
                    : calculatedGap;
                return (
                  <td key={index}>
                    <SectorValue
                      time={timing?.time ?? null}
                      gap={comparisonGap}
                      showTime={isSessionWinner}
                      bestTimeFractionDigits={3}
                      loading={loading}
                    />
                  </td>
                );
              })}
              <td>
                <RunTime
                  time={row.finalTime}
                  gap={liveGrouping && group === "on-track" ? latestSplitGap : row.finalGapToBest}
                  status={row.status}
                  startTime={row.startTime}
                  liveStartedAt={row.liveStartedAt}
                  loading={loading}
                  winner={isSessionWinner}
                  winnerLabel={liveGrouping ? "Leader" : "Winner"}
                />
              </td>
            </RiderTableRow>
            </Fragment>
          );
        })}
      </tbody>
    </DataTable>
  );
}
