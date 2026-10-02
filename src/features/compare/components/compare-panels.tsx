import { useRef } from "react";
import { formatSessionLabel, useDomainMetadata } from "../../../utils/domain-metadata";
import { useLocation } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PositionChart,
  type PositionChartPoint,
  type PositionChartSeries,
} from "../../../components/charts/position-chart";
import { MetricScatterChart } from "../../../components/charts/metric-scatter-chart";
import {
  DataTable,
  DataTableHeader,
  DataTableRow,
} from "../../../components/data-display/data-table";
import { PerformanceValue } from "../../../components/data-display/performance-value";
import { RatingValue } from "../../../components/data-display/rating-value";
import { normalizeDisplayName } from "../../../utils/display-name";
import { RiderLink } from "../../../components/navigation/rider-navigation";
import { ChartTooltip, TooltipRows } from "../../../components/overlays/tooltip";
import { riderPathForLocation } from "../../../components/navigation/rider-navigation-state";
import { formatOneDecimal } from "../../../utils/formatters";
import type { CompareData, CompareRider } from "../api/get-compare";
import styles from "./compare-panels.module.css";

const riderColors = [
  "var(--color-compare-rider-a-accent)",
  "var(--color-compare-rider-b-accent)",
];

const riderBarColors = [
  "var(--color-compare-rider-a-bar)",
  "var(--color-compare-rider-b-bar)",
];

const displayValue = (number: number | null) =>
  number === null ? "--" : formatOneDecimal(number);
const riderName = (rider: CompareRider) => normalizeDisplayName(rider.fullName);
const shortRiderName = (rider: CompareRider) => {
  const parts = riderName(rider).trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? "--";
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
};

const comparisonGap = (number: number | null) => {
  if (number === null) return "--";
  return `${number < 0 ? "-" : "+"}${Math.abs(number).toFixed(3)}`;
};

function RiderName({ rider }: { rider: CompareRider }) {
  return (
    <RiderLink className={styles.riderLink} riderId={rider.riderId}>
      {riderName(rider)}
    </RiderLink>
  );
}

function CompareSectionTitle({ children }: { children: string }) {
  return <h2 className={styles.sectionTitle}><span>//</span> {children}</h2>;
}

function comparisonClass(
  value: number | null,
  other: number | null,
  higherIsBetter: boolean,
) {
  if (value === null || other === null || value === other) return styles.tie;
  const better = higherIsBetter ? value > other : value < other;
  return better ? styles.better : styles.worse;
}

type ComparisonMetric = {
  label: string;
  value: (rider: CompareRider) => number | null;
  format?: (value: number | null) => string;
};

function CompareBarsPanel({
  title,
  riders,
  metrics,
  maximum,
}: {
  title: string;
  riders: CompareRider[];
  metrics: ComparisonMetric[];
  maximum?: number;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const values = metrics.flatMap((metric) =>
    riders.flatMap((rider) => {
      const item = metric.value(rider);
      return item === null ? [] : [item];
    }),
  );
  const rawMaximum = maximum ?? Math.max(1, ...values);
  const tickStep = maximum === undefined ? Math.max(1, Math.ceil(rawMaximum / 4)) : 25;
  const chartMaximum = maximum === undefined ? tickStep * 5 : 125;
  const chartData = metrics.map((metric) => ({
    metric: metric.label,
    riderA: metric.value(riders[0]),
    riderB: metric.value(riders[1]),
    riderALabel: metric.format?.(metric.value(riders[0])) ?? displayValue(metric.value(riders[0])),
    riderBLabel: metric.format?.(metric.value(riders[1])) ?? displayValue(metric.value(riders[1])),
  }));
  const yTicks = maximum === undefined
    ? Array.from({ length: 6 }, (_, index) => tickStep * index)
    : [0, 25, 50, 75, 100, 125];

  return (
    <div className={styles.comparisonPanel}>
      <CompareSectionTitle>{title}</CompareSectionTitle>
      <div ref={chartRef} className={styles.barChart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }} barCategoryGap="24%" barGap={8} accessibilityLayer={false}>
            <CartesianGrid className={styles.chartGrid} />
            <XAxis dataKey="metric" tickLine={false} axisLine={false} tickMargin={12} height={38} tick={{ className: styles.chartTick }} />
            <YAxis domain={[0, chartMaximum]} ticks={yTicks} tickLine={false} axisLine={false} tickMargin={8} width={38} tick={{ className: styles.chartTick }} />
            <Tooltip
              cursor={false}
              isAnimationActive={false}
              content={({ active, payload, label, coordinate }) => {
                if (!active || !payload?.length) return null;
                return (
                  <ChartTooltip
                    active={active}
                    coordinate={coordinate}
                    containerRef={chartRef}
                    label={String(label)}
                    content={
                      <TooltipRows
                        rows={payload.map((entry, index) => {
                          const labelKey = entry.dataKey === "riderA" ? "riderALabel" : "riderBLabel";
                          const formatted = (entry.payload as Record<string, unknown> | undefined)?.[labelKey];
                          return `${shortRiderName(riders[index])}: ${String(formatted ?? "--")}`;
                        })}
                      />
                    }
                  />
                );
              }}
            />
            {riders.map((rider, index) => (
              <Bar
                key={rider.riderId}
                dataKey={index === 0 ? "riderA" : "riderB"}
                fill={riderBarColors[index]}
                fillOpacity={0.5}
                stroke={riderBarColors[index]}
                strokeOpacity={0.9}
                strokeWidth={1}
                radius={[1, 1, 0, 0]}
                activeBar={false}
                maxBarSize={34}
                isAnimationActive={false}
              >
                <LabelList dataKey={index === 0 ? "riderALabel" : "riderBLabel"} position="top" offset={10} className={styles.barValue} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CompareResultsChart({ data }: { data: CompareData }) {
  return (
    <CompareBarsPanel
      title="Finals Comparison"
      riders={data.riders}
      metrics={[
        { label: "Wins", value: (rider) => rider.winsCount, format: (value) => value === null ? "--" : String(Math.round(value)) },
        { label: "Podiums", value: (rider) => rider.podiumsCount, format: (value) => value === null ? "--" : String(Math.round(value)) },
        { label: "Top 5s", value: (rider) => rider.top5Count, format: (value) => value === null ? "--" : String(Math.round(value)) },
        { label: "Top 10s", value: (rider) => rider.top10Count, format: (value) => value === null ? "--" : String(Math.round(value)) },
      ]}
    />
  );
}

export function CompareMetricChart({ data }: { data: CompareData }) {
  return (
    <CompareBarsPanel
      title="Ratings Comparison"
      riders={data.riders}
      maximum={100}
      metrics={[
        { label: "Rating", value: (rider) => rider.rating },
        { label: "Pace", value: (rider) => rider.pace },
        { label: "Consistency", value: (rider) => rider.consistency },
        { label: "Confidence", value: (rider) => rider.confidence },
      ]}
    />
  );
}

export function CompareConsistencyChart({ data }: { data: CompareData }) {
  return (
    <MetricScatterChart
      title="Pace / Consistency"
      height={349}
      xLabel="Pace"
      yLabel="Consistency"
      showAxisLabels={false}
      points={data.riders.flatMap((rider, index) => rider.roundMetrics.flatMap((round) =>
        round.pace == null || round.consistency == null ? [] : [{
          id: `${rider.riderId}-${round.roundId}`,
          label: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
          x: round.pace,
          y: round.consistency,
          color: riderColors[index],
          detail: `${shortRiderName(rider)} · ${round.venueName ?? round.trackName ?? "Unknown venue"} · Pace ${formatOneDecimal(round.pace)} · Consistency ${formatOneDecimal(round.consistency)}`,
        }],
      ))}
    />
  );
}

export function CompareSectorTable({ data }: { data: CompareData }) {
  const sectorIndexes = [...new Set(
    data.riders.flatMap((rider) =>
      rider.averageSectorGapsToBestSelected
        .filter((sector) => !sector.isFinishSector)
        .map((sector) => sector.sectorIndex),
    ),
  )].sort((left, right) => left - right);

  return (
    <div className={styles.tablePanel}>
      <CompareSectionTitle>Sectors Comparison</CompareSectionTitle>
      <DataTable embedded className={styles.comparisonTable}>
        <DataTableHeader>
          <tr>
            <th>Rider</th>
            {sectorIndexes.map((sector) => <th key={sector}>S{sector}</th>)}
            <th>Gap</th>
          </tr>
        </DataTableHeader>
        <tbody>
          {data.riders.map((rider, riderIndex) => (
            <DataTableRow key={rider.riderId}>
              <td><RiderName rider={rider} /></td>
              {sectorIndexes.map((sector) => {
                const gap = rider.sectorGapSummary.find((entry) => entry.sectorIndex === sector)?.averageGap ?? null;
                return (
                  <td key={sector}>
                    <span className={`${styles.sector} ${gap !== null && gap <= 0 ? styles.sectorBest : styles.sectorLoss}`}>
                      {comparisonGap(gap)}
                    </span>
                  </td>
                );
              })}
              <td className={comparisonClass(
                rider.averageFinishGapToBestSelected,
                data.riders[1 - riderIndex]?.averageFinishGapToBestSelected ?? null,
                false,
              )}>{comparisonGap(rider.averageFinishGapToBestSelected)}</td>
            </DataTableRow>
          ))}
        </tbody>
      </DataTable>
      <p className={styles.note}>Average loss in each sector and at the finish.</p>
    </div>
  );
}

export function CompareStatisticsTable({ data }: { data: CompareData }) {
  return (
    <div className={styles.tablePanel}>
      <CompareSectionTitle>Statistics Comparison</CompareSectionTitle>
      <DataTable embedded className={styles.comparisonTable}>
        <DataTableHeader>
          <tr>
            <th>Rider</th>
            <th>Splits won</th>
            <th>Sectors won</th>
            <th>Avg final</th>
            <th>Avg pre-final</th>
          </tr>
        </DataTableHeader>
        <tbody>
          {data.riders.map((rider, riderIndex) => {
            const other = data.riders[1 - riderIndex];
            return (
            <DataTableRow key={rider.riderId}>
              <td><RiderName rider={rider} /></td>
              <td className={comparisonClass(rider.wonSplitsCount, other?.wonSplitsCount ?? null, true)}>{rider.wonSplitsCount}</td>
              <td className={comparisonClass(rider.wonSectorsCount, other?.wonSectorsCount ?? null, true)}>{rider.wonSectorsCount}</td>
              <td className={comparisonClass(rider.averageFinalPosition, other?.averageFinalPosition ?? null, false)}>{displayValue(rider.averageFinalPosition)}</td>
              <td className={comparisonClass(rider.averagePreFinalPosition, other?.averagePreFinalPosition ?? null, false)}>{displayValue(rider.averagePreFinalPosition)}</td>
            </DataTableRow>
            );
          })}
        </tbody>
      </DataTable>
      <p className={styles.note}>Average positions, timing wins and selected-range performance.</p>
    </div>
  );
}

function comparisonResultsSeries(
  data: CompareData,
  pathname: string,
): PositionChartSeries[] {
  const sessions = [...data.commonSessions].sort(
    (left, right) =>
      (left.sessionDate ?? "").localeCompare(right.sessionDate ?? "") ||
      Number(left.sessionId) - Number(right.sessionId),
  );
  return data.riders.map((rider, riderIndex) => ({
    id: rider.riderId,
    name: riderName(rider),
    color: riderColors[riderIndex],
    href: riderPathForLocation(pathname, rider.riderId),
    averagePosition: rider.resultsAveragePosition,
    points: sessions.map((session) => {
      const result = session.results.find((item) => item.riderId === rider.riderId);
      const sessionLabel = session.sessionType?.toLowerCase().includes("final")
        ? "FIN"
        : session.sessionType ? formatSessionLabel(session.sessionType).toUpperCase() : "SESSION";
      return {
        label: `${session.season ?? "----"} · ${session.roundNumber ? `R${session.roundNumber}` : "R--"}`,
        tooltipLabel: `${session.season ?? "----"} · ${session.roundNumber ? `R${session.roundNumber}` : "R--"} · ${session.venueName ?? session.trackName ?? "Unknown venue"} · ${sessionLabel}`,
        position: result?.isClassified ? result.position : null,
        status: result?.status ?? null,
        tooltip: `${shortRiderName(rider)} · ${result?.position ? `P${result.position}` : (result?.status ?? "not classified")}`,
      };
    }),
  }));
}

function pointsSeries(data: CompareData, pathname: string): PositionChartSeries[] {
  return data.riders.map((rider, riderIndex) => {
    const roundById = new Map(rider.roundMetrics.map((round) => [round.roundId, round]));
    const ordered = [...rider.pointsProgress].sort(
      (left, right) =>
        (left.date ?? "").localeCompare(right.date ?? "") ||
        Number(left.resultId) - Number(right.resultId),
    );
    const lastByRound = new Map<string, typeof ordered[number]>();
    ordered.forEach((point) => lastByRound.set(point.roundId, point));
    const points: PositionChartPoint[] = [...lastByRound.values()].map((point) => {
      const round = roundById.get(point.roundId);
      return {
        label: `${round?.season ?? "----"} · ${round?.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
        tooltipLabel: `${round?.season ?? "----"} · ${round?.roundNumber == null ? "R--" : `R${round.roundNumber}`} · ${round?.venueName ?? round?.trackName ?? "Unknown venue"}`,
        position: point.cumulativePoints,
        tooltip: `${shortRiderName(rider)} · ${Math.round(point.cumulativePoints)} pts`,
      };
    });
    return {
      id: rider.riderId,
      name: riderName(rider),
      color: riderColors[riderIndex],
      href: riderPathForLocation(pathname, rider.riderId),
      points,
    };
  });
}

function ratingSeries(data: CompareData, pathname: string): PositionChartSeries[] {
  return data.riders.map((rider, riderIndex) => ({
    id: rider.riderId,
    name: riderName(rider),
    color: riderColors[riderIndex],
    href: riderPathForLocation(pathname, rider.riderId),
    points: [...rider.roundMetrics]
      .sort((left, right) =>
        (left.date ?? "").localeCompare(right.date ?? "") || Number(left.roundId) - Number(right.roundId),
      )
      .map((round) => ({
        label: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
        tooltipLabel: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`} · ${round.venueName ?? round.trackName ?? "Unknown venue"}`,
        position: round.rating,
        tooltip: `${shortRiderName(rider)} · Rating ${round.rating == null ? "--" : formatOneDecimal(round.rating)}`,
      })),
  }));
}

export function CompareHistoryCharts({ data }: { data: CompareData }) {
  const { pathname } = useLocation();
  return (
    <div className={styles.historyGrid}>
      <PositionChart
        title="// Points"
        compact
        scale="points"
        className={styles.historyChart}
        series={pointsSeries(data, pathname)}
        showArea={false}
      />
      <PositionChart
        title="// Rating"
        compact
        scale="rating"
        className={styles.historyChart}
        series={ratingSeries(data, pathname)}
        showArea={false}
      />
    </div>
  );
}

export function ComparePositionChart({ data }: { data: CompareData }) {
  useDomainMetadata();
  const { pathname } = useLocation();
  return (
    <PositionChart
      title="// Results"
      series={comparisonResultsSeries(data, pathname)}
      connectLines={false}
      compact
      xEdgePadding={1}
      positionPadding={5}
      heightOverride={349}
      averageLineColor="series"
      className={styles.resultsChart}
    />
  );
}

export function CompareRiderSummary({ rider }: { rider: CompareRider }) {
  return (
    <span className={styles.summaryMetrics}>
      <RatingValue value={rider.rating} />
      <PerformanceValue value={rider.pace} />
    </span>
  );
}
