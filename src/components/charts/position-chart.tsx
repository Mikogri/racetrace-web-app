import { useId, useRef, type CSSProperties } from "react";
import {
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel, PanelHeader } from "../ui/panel";
import { ChartTooltip, TooltipRows } from "../overlays/tooltip";
import { positionChartPointKey } from "./chart-data";
import styles from "./charts.module.css";

export type PositionChartPoint = {
  label: string;
  tooltipKey?: string;
  tooltipLabel?: string;
  position: number | null;
  status?: string | null;
  color?: string;
  tooltip?: string;
};

export type PositionChartSeries = {
  id: string;
  name: string;
  color: string;
  href?: string;
  points: PositionChartPoint[];
};

type LibraryPoint = PositionChartPoint & {
  x: number;
  plottedPosition: number;
};

type ChartScale = "position" | "points" | "rating";

function tooltipValue(point: LibraryPoint, scale: ChartScale) {
  if (point.position === null) return "--";
  if (scale === "position") return `P${Math.round(point.position)}`;
  if (scale === "points") return `${Math.round(point.position)} pts`;
  return point.position.toFixed(1);
}

const chartHeight = 340;
const xTicks = Array.from({ length: 11 }, (_, index) => index + 1);

function niceMaximum(value: number) {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const rounded = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return rounded * magnitude;
}

function scaleConfiguration(
  scale: ChartScale,
  series: PositionChartSeries[],
  positionPadding: number,
) {
  if (scale === "position") {
    const positions = series.flatMap((item) =>
      item.points.flatMap((point) =>
        point.position !== null && point.position > 0 ? [point.position] : [],
      ),
    );
    const worstPosition = positions.length > 0 ? Math.max(...positions) : 60;
    const maximum = worstPosition + positionPadding;
    return {
      minimum: -5,
      maximum,
      ticks: Array.from({ length: 6 }, (_, index) =>
        index === 5
          ? maximum
          : Math.round(-5 + ((maximum + 5) * index) / 5),
      ),
      normalize: (value: number) => Math.min(maximum, Math.max(1, value)),
      accepts: (value: number) => value > 0,
    };
  }
  if (scale === "rating") {
    return {
      minimum: 0,
      maximum: 100,
      ticks: [0, 25, 50, 75, 100],
      normalize: (value: number) => Math.min(100, Math.max(0, value)),
      accepts: (value: number) => value >= 0,
    };
  }

  const values = series.flatMap((item) =>
    item.points.flatMap((point) => point.position === null ? [] : [point.position]),
  );
  const maximum = niceMaximum(Math.max(0, ...values));
  return {
    minimum: 0,
    maximum,
    ticks: Array.from({ length: 5 }, (_, index) => (maximum * index) / 4),
    normalize: (value: number) => Math.min(maximum, Math.max(0, value)),
    accepts: (value: number) => value >= 0,
  };
}

function validPoints(
  item: PositionChartSeries,
  accepts: (value: number) => boolean,
) {
  return item.points.filter(
    (point): point is PositionChartPoint & { position: number } =>
      point.position !== null && accepts(point.position),
  );
}

function linePoints(
  item: PositionChartSeries,
  accepts: (value: number) => boolean,
  normalize: (value: number) => number,
): LibraryPoint[] {
  const valid = validPoints(item, accepts);
  return valid.map((point, index) => ({
    ...point,
    x: valid.length <= 1 ? 6 : 1 + (10 * index) / (valid.length - 1),
    plottedPosition: normalize(point.position),
  }));
}

function scatterPoints(
  item: PositionChartSeries,
  maximumPointCount: number,
  accepts: (value: number) => boolean,
  normalize: (value: number) => number,
): LibraryPoint[] {
  return item.points.flatMap((point, index) => {
    if (point.position === null || !accepts(point.position)) return [];
    return [
      {
        ...point,
        x:
          maximumPointCount <= 1
            ? 6
            : 1 + (10 * index) / (maximumPointCount - 1),
        plottedPosition: normalize(point.position),
      },
    ];
  });
}

export function PositionChart({
  title,
  description,
  series,
  connectLines = true,
  showAverages = true,
  className,
  compact = false,
  scale = "position",
  positionPadding = 0,
  xEdgePadding = 0,
  showArea = true,
  heightOverride,
  averageLineColor = "var(--color-rating-top)",
}: {
  title: string;
  description?: string;
  series: PositionChartSeries[];
  connectLines?: boolean;
  showAverages?: boolean;
  className?: string;
  compact?: boolean;
  scale?: ChartScale;
  positionPadding?: number;
  xEdgePadding?: number;
  showArea?: boolean;
  heightOverride?: number;
  averageLineColor?: string | "series";
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const definitionId = useId().replace(/:/g, "");
  const maximumPointCount = Math.max(
    0,
    ...series.map((item) => item.points.length),
  );
  const height = heightOverride ?? (compact ? (connectLines ? 275 : 291) : chartHeight);
  const scaleConfig = scaleConfiguration(scale, series, positionPadding);
  const { minimum, maximum, ticks: yTicks, normalize, accepts } = scaleConfig;
  const displayedXTicks = xEdgePadding > 0
    ? [1 - xEdgePadding, ...xTicks, 11 + xEdgePadding]
    : xTicks;
  const yAxisWidth =
    Math.max(...yTicks.map((tick) => String(tick).length)) * 7 + 14;

  return (
    <Panel
      padding="none"
      className={`${styles.chartPanel} ${compact ? styles.compact : ""} ${connectLines ? styles.lineChart : styles.scatterChart} ${className ?? ""}`}
    >
      <div className={styles.heading}>
        <PanelHeader
          title={title}
          {...(description ? { description } : {})}
        />
      </div>
      <div className={styles.scroll}>
        <div
          ref={chartRef}
          className={styles.libraryChart}
          style={{ height }}
          role="img"
          aria-label={title}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
              accessibilityLayer={false}
            >
              <defs>
                {series.map((item) => (
                  <linearGradient
                    id={`${definitionId}-${item.id}-area`}
                    key={`${item.id}-area`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={item.color} stopOpacity="0.2" />
                    <stop offset="62%" stopColor={item.color} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={item.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid className={styles.rechartsGrid} />
              <Tooltip
                cursor={false}
                isAnimationActive={false}
                content={({ active, payload, coordinate }) => {
                  const point = payload?.[0]?.payload as LibraryPoint | undefined;
                  if (!active || !point) return null;
                  const rows = series.flatMap((item) => {
                    const matchingPoint = item.points.find(
                      (candidate) =>
                        positionChartPointKey(candidate) ===
                          positionChartPointKey(point) &&
                        candidate.position !== null &&
                        accepts(candidate.position),
                    );
                    if (!matchingPoint || matchingPoint.position === null) return [];
                    return [
                      matchingPoint.tooltip ??
                        `${item.name}: ${tooltipValue(
                          {
                            ...matchingPoint,
                            x: point.x,
                            plottedPosition: normalize(matchingPoint.position),
                          },
                          scale,
                        )}`,
                    ];
                  });
                  return (
                    <ChartTooltip
                      active={active}
                      coordinate={coordinate}
                      containerRef={chartRef}
                      label={point.tooltipLabel ?? point.label}
                      content={<TooltipRows rows={rows} />}
                    />
                  );
                }}
              />
              <XAxis
                type="number"
                dataKey="x"
                domain={[1 - xEdgePadding, 11 + xEdgePadding]}
                ticks={displayedXTicks}
                interval={0}
                height={40}
                tickMargin={12}
                tickLine={false}
                axisLine={false}
                tick={{ className: styles.rechartsTick }}
                allowDataOverflow
              />
              <YAxis
                type="number"
                dataKey="plottedPosition"
                domain={[minimum, maximum]}
                ticks={yTicks}
                reversed={scale === "position"}
                width={yAxisWidth}
                tickMargin={8}
                tickLine={false}
                axisLine={false}
                tick={{ className: styles.rechartsTick }}
                allowDataOverflow
              />
              {series.map((item) => {
                const points = connectLines
                  ? linePoints(item, accepts, normalize)
                  : scatterPoints(item, maximumPointCount, accepts, normalize);

                return connectLines ? (
                  <Area
                    key={item.id}
                    data={points}
                    type="monotone"
                    dataKey="plottedPosition"
                    name={item.name}
                    baseValue={scale === "position" ? maximum : minimum}
                    stroke={item.color}
                    strokeWidth={1.5}
                    strokeOpacity={0.7}
                    fill={showArea ? `url(#${definitionId}-${item.id}-area)` : "transparent"}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "var(--color-surface-page)",
                      stroke: item.color,
                      strokeWidth: 2,
                    }}
                    connectNulls
                    isAnimationActive={false}
                  />
                ) : (
                  <Scatter
                    key={item.id}
                    data={points}
                    dataKey="plottedPosition"
                    name={item.name}
                    activeShape={(properties) => {
                      const active = properties as {
                        cx?: number;
                        cy?: number;
                        payload?: LibraryPoint;
                      };
                      const color = active.payload?.color ?? item.color;
                      return (
                        <circle
                          cx={active.cx}
                          cy={active.cy}
                          r={4}
                          fill={color}
                          fillOpacity={0.4}
                          stroke={color}
                          strokeWidth={1}
                          className={styles.activeScatterPoint}
                          style={{
                            "--active-point-color": color,
                          } as CSSProperties}
                        />
                      );
                    }}
                    isAnimationActive={false}
                  >
                    {points.map((point, index) => (
                      <Cell
                        key={`${item.id}-${index}`}
                        fill={point.color ?? item.color}
                        stroke={point.color ?? item.color}
                        fillOpacity={0.4}
                      />
                    ))}
                  </Scatter>
                );
              })}
              {!connectLines && showAverages
                ? series.map((item) => {
                    const points = scatterPoints(
                      item,
                      maximumPointCount,
                      accepts,
                      normalize,
                    );
                    if (points.length === 0) return null;
                    const average =
                      points.reduce(
                        (sum, point) => sum + point.plottedPosition,
                        0,
                      ) / points.length;
                    return (
                      <ReferenceLine
                        key={`${item.id}-average`}
                        y={average}
                        stroke={
                          averageLineColor === "series"
                            ? item.color
                            : averageLineColor
                        }
                        strokeWidth={1}
                        strokeOpacity={0.7}
                        strokeDasharray="3 3"
                      />
                    );
                  })
                : null}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  );
}
