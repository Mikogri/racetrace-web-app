import { useMemo, useRef } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PerformanceRadar } from "../../components/charts/performance-radar";
import {
  PositionChart,
  type PositionChartPoint,
} from "../../components/charts/position-chart";
import { MetricScatterChart } from "../../components/charts/metric-scatter-chart";
import { PerformanceValue } from "../../components/data-display/performance-value";
import { RatingValue } from "../../components/data-display/rating-value";
import { riderBasePath } from "../../components/navigation/rider-navigation-state";
import { ChartTooltip, TooltipRows } from "../../components/overlays/tooltip";
import { formatOneDecimal } from "../../utils/formatters";
import { formatSessionLabel, useDomainMetadata } from "../../utils/domain-metadata";
import { getCompetitionClassColors } from "../../utils/competition-classes";
import type { RiderSessionResult } from "./api/rider-session-schema";
import type { RiderOutletContext } from "./rider-route-layout";
import styles from "./rider-pages.module.css";

type StatisticRow = { label: string; value: string };

const resultPointColors = [
  "#6186CC",
  "#7797D2",
  "#4F73B8",
  "#CD84FE",
  "#B96EEA",
  "#D99AFF",
  "#D9827C",
  "#B96C68",
];

function distinctCount(values: Array<string | number | null>) {
  return new Set(
    values.filter((value): value is string | number => value !== null),
  ).size;
}

function PressureDeltaChart({
  points,
}: {
  points: NonNullable<RiderOutletContext["pressurePerformance"]>["points"];
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const data = points.map((point, index) => ({
      ...point,
      label: String(point.roundNumber ?? index + 1),
      delta: point.preFinalPace == null || point.finalPace == null
        ? null
        : point.finalPace - point.preFinalPace,
    }));
  const maximumBarSize = Math.max(7, Math.min(24, 180 / data.length));

  return (
    <div ref={chartRef} className={styles.pressureDeltaChart}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }} accessibilityLayer={false}>
          <CartesianGrid className={styles.pressureChartGrid} />
          <XAxis dataKey="label" height={40} tickLine={false} axisLine={false} tickMargin={12} tick={{ className: styles.pressureChartTick }} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={38} tick={{ className: styles.pressureChartTick }} />
          <ReferenceLine y={0} className={styles.pressureZeroLine} />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            content={({ active, payload, coordinate }) => {
              const point = payload?.[0]?.payload as (typeof data)[number] | undefined;
              if (!active || !point) return null;
              const signedDelta = point.delta == null
                ? "--"
                : `${point.delta >= 0 ? "+" : ""}${formatOneDecimal(point.delta)}`;
              return (
                <ChartTooltip
                  active
                  coordinate={coordinate}
                  containerRef={chartRef}
                  label={`${point.season ?? "----"} · ${point.venueName ?? point.roundName ?? "Unknown venue"}`}
                  content={<TooltipRows rows={[
                    `Pre-Final: ${formatOneDecimal(point.preFinalPace!)}`,
                    `Final: ${formatOneDecimal(point.finalPace!)}`,
                    `Delta: ${signedDelta}`,
                  ]} />}
                />
              );
            }}
          />
          <Bar dataKey="delta" maxBarSize={maximumBarSize} radius={1} activeBar={false} isAnimationActive={false}>
            {data.map((point) => {
              const color = point.delta != null && point.delta >= 0
                ? "var(--color-status-success)"
                : "var(--color-status-error)";
              return <Cell key={point.roundId} fill={color} stroke={color} fillOpacity={0.58} strokeOpacity={0.95} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function statisticRows(
  results: RiderSessionResult[],
  isFinal: boolean,
  overview: RiderOutletContext["overview"],
): StatisticRow[] {
  const positions = results
    .filter((result) => result.isClassified && result.position !== null)
    .map((result) => result.position as number);
  const topSpeeds = results
    .map((result) => result.topSpeed)
    .filter((speed): speed is number => speed !== null && speed > 0);
  const statistics = overview.statistics;
  const fallbackSpeed = isFinal
    ? statistics.speed?.final.topSpeed
    : statistics.speed?.qualification.topSpeed;
  const topSpeed =
    topSpeeds.length > 0 ? Math.max(...topSpeeds) : fallbackSpeed;

  return [
    {
      label: "Seasons",
      value: String(distinctCount(results.map((result) => result.season))),
    },
    {
      label: "Wins",
      value: String(positions.filter((position) => position === 1).length),
    },
    {
      label: "Podiums",
      value: String(positions.filter((position) => position <= 3).length),
    },
    {
      label: "Top 10",
      value: String(positions.filter((position) => position <= 10).length),
    },
    {
      label: "Splits won",
      value: String(
        isFinal
          ? statistics.finalWonSplitsCount
          : statistics.preFinalWonSplitsCount,
      ),
    },
    {
      label: "Sectors won",
      value: String(
        isFinal
          ? statistics.finalWonSectorsCount
          : statistics.preFinalWonSectorsCount,
      ),
    },
    {
      label: "Top speed",
      value: topSpeed == null ? "--" : `${formatOneDecimal(topSpeed)} km/h`,
    },
  ];
}

function StatisticsTable({
  title,
  rows,
}: {
  title: string;
  rows: StatisticRow[];
}) {
  return (
    <section className={styles.statisticsPanel}>
      <h2 className={styles.statisticsTitle}>
        <span>//</span> {title}
      </h2>
      <table className={styles.statisticsTable}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Metric({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`${styles.metric} ${last ? styles.metricLast : ""}`}>
      <span>{label}</span>
      {children}
    </div>
  );
}

export default function RiderDetailsPage() {
  useDomainMetadata();
  const location = useLocation();
  const { riderId, overview, sessionResults, pressurePerformance } =
    useOutletContext<RiderOutletContext>();
  const data = overview.statistics;
  const roundById = useMemo(
    () => new Map(overview.roundResults.map((round) => [round.roundId, round])),
    [overview.roundResults],
  );

  const toChartPoint = (
    result: RiderSessionResult,
    color: string,
  ): PositionChartPoint & { order: string } => {
    const round = roundById.get(result.roundId);
    const abbreviation = formatSessionLabel(result.sessionType, "abbreviation");
    const roundLabel =
      (result.roundNumber ?? round?.roundNumber)
        ? `R${result.roundNumber ?? round?.roundNumber}`
        : "R--";
    return {
      label: `${roundLabel} ${abbreviation}`,
      tooltipKey: `${result.season ?? round?.season ?? "----"}-${result.roundId}-${result.sessionId}`,
      tooltipLabel: `${result.season ?? round?.season ?? "----"} · ${roundLabel} · ${abbreviation}`,
      position: result.isClassified ? result.position : null,
      color,
      status: result.isClassified ? null : result.status,
      tooltip: `${result.venueName ?? round?.venueName ?? round?.trackName ?? "Unknown venue"} · ${abbreviation} · ${result.isClassified ? `P${result.position}` : result.status}`,
      order: `${result.date ?? round?.roundStartDate ?? ""}-${String(result.sessionOrder).padStart(2, "0")}-${result.sessionId}`,
    };
  };

  const allPoints = [...sessionResults]
    .sort(
      (left, right) =>
        `${left.date ?? ""}-${String(left.sessionOrder).padStart(2, "0")}-${left.sessionId}`.localeCompare(
          `${right.date ?? ""}-${String(right.sessionOrder).padStart(2, "0")}-${right.sessionId}`,
        ),
    )
    .map((result, index) =>
      toChartPoint(
        result,
        resultPointColors[index % resultPointColors.length],
      ),
    );
  const orderedRoundResults = [...overview.roundResults].sort((left, right) =>
    `${left.roundStartDate ?? ""}-${String(left.roundNumber ?? 0).padStart(2, "0")}-${left.roundId}`.localeCompare(
      `${right.roundStartDate ?? ""}-${String(right.roundNumber ?? 0).padStart(2, "0")}-${right.roundId}`,
    ),
  );
  const pointsByRound: PositionChartPoint[] = orderedRoundResults.map((round) => {
    const cumulativePoints = overview.chartStatistics.cumulativePointsByRound[round.roundId] ?? null;
    return {
      label: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
      position: cumulativePoints,
      color: "var(--color-chart-points)",
      tooltip: `${round.venueName ?? round.trackName ?? "Unknown venue"} · ${cumulativePoints ?? "--"} total points`,
    };
  });
  const ratingByRound: PositionChartPoint[] = orderedRoundResults.map((round) => ({
    label: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
    position: round.rating,
    color: "var(--color-chart-rating)",
    tooltip: `${round.venueName ?? round.trackName ?? "Unknown venue"} · Rating ${round.rating == null ? "--" : formatOneDecimal(round.rating)}`,
  }));
  const consistencyPoints = orderedRoundResults.flatMap((round) =>
    round.pace == null || round.consistency == null ? [] : [{
      id: round.roundId,
      label: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
      x: round.pace,
      y: round.consistency,
      color: getCompetitionClassColors({ code: round.competitionClassCode, name: round.competitionClassName, abbreviation: round.competitionClassAbbreviation }).chart,
      detail: `${round.venueName ?? round.trackName ?? "Unknown venue"} · Pace ${formatOneDecimal(round.pace)} · Consistency ${formatOneDecimal(round.consistency)}`,
    }],
  );
  const preFinalResults = sessionResults.filter((result) => !result.isFinal);
  const finalResults = sessionResults.filter((result) => result.isFinal);
  const validPositions = sessionResults
    .filter((result) => result.isClassified && result.position !== null)
    .map((result) => result.position as number);
  const otherRows: StatisticRow[] = [
    {
      label: "Seasons",
      value: String(
        distinctCount(sessionResults.map((result) => result.season)),
      ),
    },
    {
      label: "Rounds",
      value: String(
        distinctCount(sessionResults.map((result) => result.roundId)),
      ),
    },
    {
      label: "Sessions",
      value: String(
        distinctCount(sessionResults.map((result) => result.sessionId)),
      ),
    },
    {
      label: "Best",
      value:
        validPositions.length > 0 ? String(Math.min(...validPositions)) : "--",
    },
    {
      label: "DNS",
      value: String(
        sessionResults.filter((result) => result.status === "DNS").length,
      ),
    },
    {
      label: "DNF",
      value: String(
        sessionResults.filter((result) => result.status === "DNF").length,
      ),
    },
    {
      label: "DSQ",
      value: String(
        sessionResults.filter((result) => result.status === "DSQ").length,
      ),
    },
  ];
  const riderHref = riderBasePath(location.pathname, riderId);
  const positionScore =
    data.averagePosition === null
      ? 0
      : Math.max(0, Math.min(100, ((120 - data.averagePosition) * 100) / 119));

  const chartSeries = (points: PositionChartPoint[], color: string) => [
    { id: riderId, name: data.fullName, color, href: riderHref, points, averagePosition: overview.chartStatistics.resultsAveragePosition },
  ];
  const displayedPressurePerformance = pressurePerformance?.pressurePerformance == null
    ? null
    : Math.round(pressurePerformance.pressurePerformance * 100) / 100;

  return (
    <div className={`${styles.content} ${styles.statsContent}`}>
      <section className={styles.metrics} aria-label="Rider statistics">
        <Metric label="Rating">
          <RatingValue value={data.rating} size="large" />
        </Metric>
        <Metric label="Pace">
          <PerformanceValue value={data.pace} size="large" />
        </Metric>
        <Metric label="Consistency">
          <PerformanceValue value={data.consistency} size="large" />
        </Metric>
        <Metric label="Confidence">
          <PerformanceValue value={data.confidence} percent size="large" />
        </Metric>
        <Metric label="Avg position">
          <strong className={styles.positionValue}>
            {data.averagePosition == null
              ? "--"
              : data.averagePosition.toFixed(2)}
          </strong>
        </Metric>
        <Metric label="Points">
          <strong className={styles.pointsValue}>
            {Math.round(data.totalPoints)}
          </strong>
        </Metric>
        <Metric label="Position" last>
          <strong className={styles.pointsValue}>
            {data.rankingPosition ?? "--"}
          </strong>
        </Metric>
      </section>

      <section className={styles.chartRow}>
        <div className={styles.chartCell}>
          <PositionChart
            title="// Results"
            connectLines={false}
            compact
            xEdgePadding={1}
            positionPadding={5}
            series={chartSeries(allPoints, "#f1f1ed")}
          />
        </div>
        <div className={styles.chartCell}>
          <PerformanceRadar
            title="// Performance"
            compact
            metrics={[
              {
                label: "Rating",
                value: data.rating,
                display:
                  data.rating == null ? "--" : formatOneDecimal(data.rating),
              },
              {
                label: "Pace",
                value: data.pace,
                display: data.pace == null ? "--" : formatOneDecimal(data.pace),
              },
              {
                label: "Confidence",
                value: data.confidence,
                display: `${formatOneDecimal(data.confidence)}%`,
              },
              {
                label: "Consistency",
                value: data.consistency,
                display:
                  data.consistency == null
                    ? "--"
                    : formatOneDecimal(data.consistency),
              },
              {
                label: "Avg position",
                value: data.averagePosition,
                score: positionScore,
                display:
                  data.averagePosition == null
                    ? "--"
                    : formatOneDecimal(data.averagePosition),
              },
            ]}
          />
        </div>
      </section>

      <section className={styles.chartRow}>
        <div className={styles.chartCell}>
          <PositionChart
            title="// Points"
            compact
            scale="points"
            series={chartSeries(pointsByRound, "var(--color-chart-points)")}
          />
        </div>
        <div className={styles.chartCell}>
          <PositionChart
            title="// Rating"
            compact
            scale="rating"
            series={chartSeries(ratingByRound, "var(--color-chart-rating)")}
          />
        </div>
      </section>

      <section className={styles.chartRow}>
        <div className={styles.chartCell}>
          <div className={styles.pressureCell}>
            <div className={styles.pressureChartBlock}>
              <div className={styles.pressureChartHeader}>
                <h2><span>//</span> Final Pace - Pre-Final Pace</h2>
                <strong
                  data-trend={
                    displayedPressurePerformance == null
                      ? "unavailable"
                      : displayedPressurePerformance > 0
                        ? "positive"
                        : displayedPressurePerformance < 0
                          ? "negative"
                          : "neutral"
                  }
                >
                  {displayedPressurePerformance == null
                    ? "--"
                    : `${displayedPressurePerformance > 0 ? "↑" : displayedPressurePerformance < 0 ? "↓" : "→"} ${displayedPressurePerformance > 0 ? "+" : ""}${displayedPressurePerformance.toFixed(2)}`}
                </strong>
              </div>
              <PressureDeltaChart points={pressurePerformance?.points ?? []} />
            </div>
          </div>
        </div>
        <div className={styles.chartCell}>
          <MetricScatterChart
            title="Pace / Consistency"
            xLabel="Pace"
            yLabel="Consistency"
            showAxisLabels={false}
            points={consistencyPoints}
            emptyMode="chart"
          />
        </div>
      </section>

      <section className={styles.statisticsGrid}>
        <StatisticsTable title="Other" rows={otherRows} />
        <StatisticsTable
          title="Pre-Final"
          rows={statisticRows(preFinalResults, false, overview)}
        />
        <StatisticsTable
          title="Finals"
          rows={statisticRows(finalResults, true, overview)}
        />
      </section>
    </div>
  );
}
