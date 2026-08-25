import { useRef } from "react";
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
import styles from "./metric-scatter-chart.module.css";

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
}: {
  title: string;
  xLabel: string;
  yLabel: string;
  points: MetricScatterPoint[];
  showAxisLabels?: boolean;
  legend?: Array<{ label: string; color: string }>;
  emptyMode?: "message" | "chart";
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.panel}>
      <h2><span>//</span> {title}</h2>
      <div ref={chartRef} className={styles.chart}>
        {points.length === 0 && emptyMode === "message" ? (
          <div className={styles.empty}>No comparable data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 18, bottom: 12, left: 0 }} accessibilityLayer={false}>
              <CartesianGrid className={styles.grid} />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
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
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
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
