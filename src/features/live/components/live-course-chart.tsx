import { useRef } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RiderLink } from "../../../components/navigation/rider-navigation";
import { ChartTooltip, TooltipRows } from "../../../components/overlays/tooltip";
import { Panel, PanelHeader } from "../../../components/ui/panel";
import { formatGap } from "../../../utils/formatters";
import type { LiveCourseRider } from "../api/get-live";
import styles from "./live-course-chart.module.css";

const COURSE_STEPS = 5;
const COURSE_LABELS = ["S1", "S2", "S3", "S4", "Finish"];
const RIDER_COLORS = Array.from(
  { length: 6 },
  (_, index) => `var(--color-live-chart-rider-${index + 1})`,
);

function formatLiveGap(value: number | null) {
  if (value === null) return "--";
  if (value === 0) return "-0.000";
  const absolute = Math.abs(value);
  const fractionDigits = absolute < 10 ? 3 : absolute < 100 ? 2 : 1;
  return formatGap(value, fractionDigits);
}

function abbreviatedRiderName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  return `${parts[0]?.charAt(0) ?? ""}. ${parts.slice(1).join(" ")}`;
}

export function LiveCourseChart({ riders, riderIds }: {
  riders: LiveCourseRider[];
  riderIds: Map<string, string> | undefined;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const displayedGaps = riders.flatMap((rider) => rider.points.map((point) => point.gap));
  const minimumGap = Math.min(0, ...displayedGaps);
  const maximumGap = Math.max(0, ...displayedGaps);
  const gapRange = maximumGap - minimumGap;
  const proportionalPadding = gapRange * 0.2;
  const minimumIntervalPadding = Math.max(0, (6 - gapRange) / 2);
  const edgePadding = Math.max(proportionalPadding, minimumIntervalPadding);
  const domainMaximum = maximumGap + edgePadding;
  const domainMinimum = minimumGap - edgePadding;
  const domainRange = domainMaximum - domainMinimum;
  const yTicks = Array.from({ length: 7 }, (_, index) =>
    domainMinimum + (domainRange * index) / 6,
  );
  const data = Array.from({ length: COURSE_STEPS }, (_, index) => {
    const split = index + 1;
    return {
      split,
      label: COURSE_LABELS[index],
      ...Object.fromEntries(riders.map((rider) => [
        rider.key,
        rider.points.find((point) => point.split === split)?.gap ?? null,
      ])),
    };
  });

  return (
    <Panel padding="none" className={styles.wrapper}>
      <div className={styles.header}>
        <PanelHeader title="On Track" description="On track riders compared to leader" />
      </div>
      <div className={styles.stage}>
        <div ref={chartRef} className={styles.chart} role="img" aria-label="Live rider gaps across four splits and finish">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 40, bottom: 0, left: 0 }} accessibilityLayer={false}>
              <CartesianGrid className={styles.grid} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ className: styles.tick }}
                tickMargin={12}
              />
              <YAxis
                domain={[domainMinimum, domainMaximum]}
                ticks={yTicks}
                reversed
                tickLine={false}
                axisLine={false}
                tick={{ className: styles.tick }}
                tickFormatter={(value: number) => value === 0 ? "0.000" : `${value > 0 ? "+" : ""}${value.toFixed(1)}`}
                width={48}
              />
              <Tooltip
                cursor={false}
                isAnimationActive={false}
                content={({ active, payload, label, coordinate }) => {
                  if (!active || !payload?.length) return null;
                  const values = payload
                    .filter((entry) => typeof entry.value === "number")
                    .map((entry) => (
                      <span className={styles.tooltipRider} key={String(entry.dataKey)}>
                        <i aria-hidden="true" style={{ backgroundColor: entry.color }} />
                        <span>{entry.name}: {formatLiveGap(Number(entry.value))}</span>
                      </span>
                    ));
                  return values.length > 0 ? (
                    <ChartTooltip
                      active={active}
                      coordinate={coordinate}
                      containerRef={chartRef}
                      label={String(label)}
                      content={<TooltipRows rows={values} />}
                    />
                  ) : null;
                }}
              />
              {riders.map((rider, index) => {
                const color = RIDER_COLORS[index % RIDER_COLORS.length];
                return (
                  <Line
                    key={rider.key}
                    type="linear"
                    dataKey={rider.key}
                    name={rider.fullName}
                    stroke={color}
                    strokeWidth={1}
                    {...(!rider.isLeader ? { strokeDasharray: "4 5" } : {})}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    isAnimationActive
                    animationDuration={300}
                    animationEasing="ease-out"
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.plotFrame} aria-hidden="true" />
      </div>
      <div className={styles.riderLegend} aria-label="Riders shown on chart">
        {riders.map((rider, index) => {
          const riderId = rider.uciId ? riderIds?.get(rider.uciId) : undefined;
          const label = <>{abbreviatedRiderName(rider.fullName)} · P{rider.position ?? "--"}</>;
          return (
            <div className={styles.legendItem} key={rider.key}>
              <i style={{ backgroundColor: RIDER_COLORS[index % RIDER_COLORS.length] }} />
              {riderId ? <RiderLink riderId={riderId}>{label}</RiderLink> : <span>{label}</span>}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
