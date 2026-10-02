import { useRef, type CSSProperties } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "../overlays/tooltip";
import { formatOneDecimal } from "../../utils/formatters";
import { metricAxisConfiguration } from "./chart-data";
import styles from "./metric-scatter-chart.module.css";
import chartStyles from "./charts.module.css";

export type MetricScatterPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  detail?: string;
};

export function MetricScatterChart({
  title,
  xLabel,
  yLabel,
  points,
  showAxisLabels = true,
  legend = [],
  emptyMode = "message",
  height = 275,
}: {
  title: string;
  xLabel: string;
  yLabel: string;
  points: MetricScatterPoint[];
  showAxisLabels?: boolean;
  legend?: Array<{ label: string; color: string }>;
  emptyMode?: "message" | "chart";
  height?: number;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const xAxis = metricAxisConfiguration(points.map((point) => point.x));
  const yAxis = metricAxisConfiguration(points.map((point) => point.y));
  return (
    <div className={styles.panel}>
      <h2><span>//</span> {title}</h2>
      <div ref={chartRef} className={styles.chart} style={{ height }}>
        {points.length === 0 && emptyMode === "message" ? (
          <div className={styles.empty}>No comparable data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 18, bottom: 0, left: 0 }} accessibilityLayer={false}>
              <CartesianGrid className={styles.grid} />
              <XAxis
                type="number"
                dataKey="x"
                domain={xAxis.domain}
                ticks={xAxis.ticks}
                height={40}
                tickMargin={12}
                tickLine={false}
                axisLine={false}
                tick={{ className: styles.tick }}
                {...(showAxisLabels ? {
                  label: { value: xLabel, position: "insideBottomRight" as const, offset: -8, className: styles.axisLabel },
                } : {})}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={yAxis.domain}
                ticks={yAxis.ticks}
                tickMargin={8}
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ className: styles.tick }}
                {...(showAxisLabels ? {
                  label: { value: yLabel, angle: -90, position: "insideLeft" as const, className: styles.axisLabel },
                } : {})}
              />
              <Tooltip
                cursor={false}
                isAnimationActive={false}
                content={({ active, payload, coordinate }) => {
                  const point = payload?.[0]?.payload as MetricScatterPoint | undefined;
                  if (!active || !point) return null;
                  return (
                    <ChartTooltip
                      active={active}
                      coordinate={coordinate}
                      containerRef={chartRef}
                      label={point.label}
                      content={point.detail ?? `${xLabel}: ${formatOneDecimal(point.x)} · ${yLabel}: ${formatOneDecimal(point.y)}`}
                    />
                  );
                }}
              />
              <Scatter
                data={points}
                isAnimationActive
                animationDuration={300}
                activeShape={(properties) => {
                  const item = properties as { cx?: number; cy?: number; payload?: MetricScatterPoint };
                  const color = item.payload?.color ?? "var(--color-brand-primary)";
                  return (
                    <circle
                      cx={item.cx}
                      cy={item.cy}
                      r={4}
                      fill={color}
                      fillOpacity={0.4}
                      stroke={color}
                      strokeWidth={1}
                      className={chartStyles.activeScatterPoint}
                      style={{ "--active-point-color": color } as CSSProperties}
                    />
                  );
                }}
                shape={(properties) => {
                  const item = properties as { cx?: number; cy?: number; payload?: MetricScatterPoint };
                  const color = item.payload?.color ?? "var(--color-brand-primary)";
                  return <circle cx={item.cx} cy={item.cy} r={4} fill={color} fillOpacity={0.4} stroke={color} strokeWidth={1} />;
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
      {legend.length > 0 ? (
        <div className={styles.legend} aria-label="Chart legend">
          {legend.map((item) => (
            <span key={item.label}>
              <i style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
