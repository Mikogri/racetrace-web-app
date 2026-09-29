import { useRef } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "../../../components/overlays/tooltip";
import { normalizeDisplayName } from "../../../utils/display-name";
import type { RoundRaceAnalytics } from "../api/round-race-analytics-schema";
import styles from "./round-race-sections.module.css";

export type AnalyticsBar = { label: string; value: number; detail: string; color: string };

export function RoundAnalyticsBars({ data, unit, integers = false }: { data: AnalyticsBar[]; unit: string; integers?: boolean }) {
  const chartRef = useRef<HTMLDivElement>(null);
  return <div className={styles.chart} ref={chartRef} aria-label={unit}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} accessibilityLayer={false} margin={{ top: 16, right: 12, bottom: 12, left: 0 }}>
        <CartesianGrid className={styles.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ className: styles.tick }} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={!integers} width={42} tick={{ className: styles.tick }} />
        <ReferenceLine y={0} stroke="var(--color-border-default)" />
        <Tooltip cursor={false} isAnimationActive={false} content={({ active, payload, coordinate }) => {
          const point = payload?.[0]?.payload as AnalyticsBar | undefined;
          return active && point ? <ChartTooltip active={active} coordinate={coordinate} containerRef={chartRef} label={point.label} content={point.detail} /> : null;
        }} />
        <Bar dataKey="value" maxBarSize={28} fillOpacity={0.4} strokeWidth={1} radius={[1, 1, 0, 0]} isAnimationActive={false}>
          {data.map((point) => <Cell key={point.label} fill={point.color} stroke={point.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <span className={styles.axisUnit}>{unit}</span>
  </div>;
}

export function QualiFinalChart({ correlation }: { correlation: RoundRaceAnalytics["correlation"] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  return <div className={styles.chart} ref={chartRef} aria-label="Pre-final position compared with final position">
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart accessibilityLayer={false} margin={{ top: 16, right: 16, bottom: 12, left: 0 }}>
        <CartesianGrid className={styles.grid} />
        <XAxis dataKey="preFinalPosition" type="number" domain={[0, "dataMax + 1"]} allowDecimals={false}
          tickLine={false} axisLine={false} tick={{ className: styles.tick }} tickFormatter={(value: number) => `P${value}`} />
        <YAxis dataKey="finalPosition" type="number" domain={[0, "dataMax + 1"]} reversed allowDecimals={false}
          tickLine={false} axisLine={false} tick={{ className: styles.tick }} width={42} tickFormatter={(value: number) => `P${value}`} />
        <Tooltip cursor={false} isAnimationActive={false} content={({ active, payload, coordinate }) => {
          const rider = payload?.[0]?.payload as RoundRaceAnalytics["correlation"]["points"][number] | undefined;
          return active && rider ? <ChartTooltip active={active} coordinate={coordinate} containerRef={chartRef}
            label={normalizeDisplayName(rider.fullName)} content={`${correlation.preFinalSession ?? "Pre-final"}: P${rider.preFinalPosition} → Final: P${rider.finalPosition}`} /> : null;
        }} />
        <Scatter data={correlation.points} fill="var(--color-chart-pre-final)" isAnimationActive={false}
          shape={(props) => {
            const point = props as { cx?: number; cy?: number; payload?: { finalPosition: number } };
            const color = point.payload?.finalPosition === 1 ? "var(--color-rating-top)" : "var(--color-chart-pre-final)";
            return <circle cx={point.cx} cy={point.cy} r={4} fill={color} fillOpacity={0.4} stroke={color} strokeWidth={1} />;
          }}
          activeShape={(props) => {
            const point = props as { cx?: number; cy?: number; payload?: { finalPosition: number } };
            const color = point.payload?.finalPosition === 1 ? "var(--color-rating-top)" : "var(--color-chart-pre-final)";
            return <circle cx={point.cx} cy={point.cy} r={4} fill={color} fillOpacity={0.4} stroke={color} strokeWidth={1} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />;
          }} />
      </ScatterChart>
    </ResponsiveContainer>
    <span className={styles.axisUnit}>X: {correlation.preFinalSession ?? "Pre-final"} position · Y: Final position</span>
  </div>;
}
