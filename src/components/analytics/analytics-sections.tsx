import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TableFeedbackState } from "../feedback/states";
import { ChartTooltip } from "../overlays/tooltip";
import { Panel, PanelHeader } from "../ui/panel";
import { routes } from "../../config/routes";
import { normalizeDisplayName } from "../../utils/display-name";
import { formatOneDecimal, formatRaceTime } from "../../utils/formatters";
import type { RoundProfile } from "../../features/analytics/api/get-round-profile";
import {
  CategorySelector,
  SectionAction,
  SectionHeader,
} from "./section-controls";
import { classCode } from "./round-label";
import styles from "./home-sections.module.css";
import { PlotAreaBlur } from "../charts/plot-area-blur";

type SpeedResult = {
  riderId: string;
  fullName: string;
  position: number | null;
  finalTime: number | null;
  topSpeed: number | null;
  isPerfectRun: boolean;
};

export function SpeedVsRunTimeSection({
  summary,
  round: selectedRound,
  embedded = false,
  results,
  loading,
  updating,
  category,
  onCategoryChange,
}: {
  summary?: { lastCompletedRound: RoundProfile["round"] };
  round?: RoundProfile["round"];
  embedded?: boolean;
  results: SpeedResult[];
  loading: boolean;
  updating: boolean;
  category: string;
  onCategoryChange: (value: string) => void;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const round = selectedRound ?? summary?.lastCompletedRound;
  const points = results
    .flatMap((result) =>
      !result.isPerfectRun &&
      result.position !== null &&
      result.position <= 20 &&
      result.finalTime !== null &&
      result.finalTime > 0 &&
      result.topSpeed !== null &&
      result.topSpeed > 0
        ? [
            {
              riderId: result.riderId,
              name: normalizeDisplayName(result.fullName),
              position: result.position,
              time: result.finalTime,
              topSpeed: result.topSpeed,
            },
          ]
        : [],
    )
    .sort((left, right) => left.time - right.time)
    .slice(0, 20);
  const times = points.map((point) => point.time);
  const speeds = points.map((point) => point.topSpeed);
  const minimumTime = times.length > 0 ? Math.min(...times) : 0;
  const maximumTime = times.length > 0 ? Math.max(...times) : 1;
  const timePadding = Math.max((maximumTime - minimumTime) * 0.08, 0.5);
  const timeDomainMinimum = minimumTime - timePadding;
  const timeDomainMaximum = maximumTime + timePadding;
  const timeTicks = Array.from(
    { length: 5 },
    (_, index) =>
      timeDomainMinimum + ((timeDomainMaximum - timeDomainMinimum) * index) / 4,
  );
  const minimumSpeed = speeds.length > 0 ? Math.min(...speeds) : 0;
  const maximumSpeed = speeds.length > 0 ? Math.max(...speeds) : 100;
  const speedPadding = Math.max((maximumSpeed - minimumSpeed) * 0.12, 1);

  return (
    <div
      className={`${styles.sectionBlock} ${embedded ? styles.embeddedAnalytics : ""}`}
    >
      {embedded ? (
        <PanelHeader
          title="// Top Speed vs Run Time"
          info="Final run time compared with top speed. Faster runs appear further to the right."
        />
      ) : (
        <SectionHeader
          title="Top Speed vs Run Time"
          meta={[
            classCode(round),
            `Round ${round?.roundNumber ?? "--"}`,
            `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`,
          ]}
          description="Final run time compared with each rider's top speed"
        />
      )}
      <Panel
        padding="none"
        className={`${styles.homePanel} ${styles.speedPanel}`}
      >
        <div className={styles.speedChartHeader}>
          <div>
            <strong>Final Performance</strong>
            <span>Shorter run times are shown further to the right</span>
          </div>
          {!embedded && (
            <CategorySelector value={category} onChange={onCategoryChange} />
          )}
        </div>
        {loading ? (
          <div
            className={styles.speedChartSkeleton}
            aria-label="Loading final performance chart"
          >
            <span aria-hidden="true" />
          </div>
        ) : (
          <div
            ref={chartRef}
            className={`${styles.speedChart} ${updating ? styles.speedChartUpdating : ""}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 18, right: 42, bottom: 8, left: 4 }}
                accessibilityLayer={false}
              >
                <PlotAreaBlur />
                <CartesianGrid className={styles.speedGrid} />
                <XAxis
                  type="number"
                  dataKey="time"
                  reversed
                  domain={[timeDomainMinimum, timeDomainMaximum]}
                  ticks={timeTicks}
                  tickFormatter={(value: number) => formatRaceTime(value)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ className: styles.speedTick }}
                  tickMargin={12}
                  name="Run time"
                  unit="s"
                />
                <YAxis
                  type="number"
                  dataKey="topSpeed"
                  domain={[
                    minimumSpeed - speedPadding,
                    maximumSpeed + speedPadding,
                  ]}
                  tickFormatter={(value: number) => formatOneDecimal(value)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ className: styles.speedTick }}
                  tickMargin={8}
                  width={45}
                  name="Top speed"
                />
                <Tooltip
                  cursor={false}
                  isAnimationActive={false}
                  content={({ active, payload, coordinate }) => {
                    const point = payload?.[0]?.payload as
                      (typeof points)[number] | undefined;
                    if (!active || !point) return null;
                    return (
                      <ChartTooltip
                        active={active}
                        coordinate={coordinate}
                        containerRef={chartRef}
                        label={point.name}
                        content={`${formatRaceTime(point.time)} · ${formatOneDecimal(point.topSpeed)} km/h`}
                      />
                    );
                  }}
                />
                <Scatter
                  data={points}
                  shape={(properties) => {
                    const item = properties as {
                      cx?: number;
                      cy?: number;
                      payload?: (typeof points)[number];
                    };
                    const color =
                      item.payload?.position === 1
                        ? "var(--color-rating-top)"
                        : "var(--color-chart-pre-final)";
                    return (
                      <circle
                        cx={item.cx}
                        cy={item.cy}
                        r={4}
                        fill={color}
                        fillOpacity={0.4}
                        stroke={color}
                        strokeWidth={1}
                      />
                    );
                  }}
                  activeShape={(properties) => {
                    const item = properties as {
                      cx?: number;
                      cy?: number;
                      payload?: (typeof points)[number];
                    };
                    const color =
                      item.payload?.position === 1
                        ? "var(--color-rating-top)"
                        : "var(--color-chart-pre-final)";
                    return (
                      <circle
                        cx={item.cx}
                        cy={item.cy}
                        r={4}
                        fill={color}
                        fillOpacity={0.4}
                        stroke={color}
                        strokeWidth={1}
                        className={styles.speedActivePoint}
                        style={
                          { "--speed-point-color": color } as CSSProperties
                        }
                      />
                    );
                  }}
                  isAnimationActive
                  animationDuration={300}
                >
                  {points.map((point, index) => {
                    const color =
                      point.position === 1
                        ? "var(--color-rating-top)"
                        : "var(--color-chart-pre-final)";
                    return (
                      <Cell
                        key={`${point.riderId ?? "rider"}-${index}`}
                        fill={color}
                        stroke={color}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>
      {!embedded && (
        <SectionAction
          to={round ? routes.round(round.roundId) : routes.results}
        >
          See Round Details
        </SectionAction>
      )}
    </div>
  );
}

function AnalyticsBarChartSkeleton({
  rows,
  label,
}: {
  rows: number;
  label: string;
}) {
  return (
    <div className={styles.analyticsChart} role="status" aria-label={label}>
      <div className={styles.analyticsSkeletonRows} aria-hidden="true">
        {Array.from({ length: rows }, (_, index) => (
          <div className={styles.analyticsSkeletonRow} key={index}>
            <span />
            <span style={{ width: `${40 + (index % 3) * 20}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsBarChart({
  points,
}: {
  points: Array<{
    label: string;
    value: number;
    detail: string;
    color: string;
  }>;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={chartRef} className={styles.analyticsChart}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={points}
          layout="vertical"
          margin={{ top: 8, right: 18, bottom: 8, left: 0 }}
          barCategoryGap="38%"
          accessibilityLayer={false}
        >
          <PlotAreaBlur />
          <CartesianGrid className={styles.analyticsChartGrid} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="label"
            width={36}
            tickLine={false}
            axisLine={false}
            tick={{ className: styles.analyticsChartTick }}
          />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            content={({ active, payload, coordinate }) => {
              const point = payload?.[0]?.payload as
                { label: string; detail: string } | undefined;
              return active && point ? (
                <ChartTooltip
                  active
                  coordinate={coordinate}
                  containerRef={chartRef}
                  label={point.label}
                  content={point.detail}
                />
              ) : null;
            }}
          />
          <Bar
            dataKey="value"
            radius={1}
            maxBarSize={14}
            fillOpacity={0.5}
            strokeOpacity={0.9}
            strokeWidth={1}
            activeBar={false}
            isAnimationActive={false}
          >
            {points.map((point) => (
              <Cell key={point.label} fill={point.color} stroke={point.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type RoundAnalyticsProps = {
  embedded?: boolean;
  children?: ReactNode;
  profile?: RoundProfile;
  loading: boolean;
  error: boolean;
  category: string;
  onCategoryChange: (value: string) => void;
};

export function TrackFingerprintSection({
  embedded = false,
  children,
  profile,
  loading,
  error,
  category,
  onCategoryChange,
}: RoundAnalyticsProps) {
  const fingerprint = profile?.trackFingerprint.sectors ?? [];
  const round = profile?.round;
  return (
    <div
      className={`${styles.sectionBlock} ${embedded ? styles.embeddedAnalytics : ""}`}
    >
      {embedded ? (
        <PanelHeader
          title="// Track Fingerprint"
          info="How strongly each sector separated the field in the final."
        />
      ) : (
        <SectionHeader
          title="Track Fingerprint"
          meta={[
            classCode(round),
            `Round ${round?.roundNumber ?? "--"}`,
            `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`,
          ]}
          description="How strongly each sector separated the field in the final"
        />
      )}
      <Panel
        padding="none"
        className={`${styles.homePanel} ${styles.analyticsPanel}`}
      >
        <div className={styles.speedChartHeader}>
          <div>
            <strong>Sector Impact</strong>
            <span>Relative influence on the final result</span>
          </div>
          {!embedded && (
            <CategorySelector value={category} onChange={onCategoryChange} />
          )}
        </div>
        {loading ? (
          <AnalyticsBarChartSkeleton
            rows={fingerprint.length || 5}
            label="Loading Track Fingerprint"
          />
        ) : error || fingerprint.length === 0 ? (
          <TableFeedbackState type={error ? "error" : "empty"} />
        ) : (
          <AnalyticsBarChart
            points={fingerprint.map((sector) => ({
              label: sector.label,
              value: sector.decisiveness,
              detail: `${formatOneDecimal(sector.relativeImpact)}% relative impact · ${sector.ridersCount} riders`,
              color: "var(--color-brand-primary)",
            }))}
          />
        )}
      </Panel>
      {children}
      {!embedded && (
        <SectionAction
          to={
            round
              ? `${routes.round(round.roundId)}?tab=analyze`
              : routes.results
          }
        >
          Explore Round Analysis
        </SectionAction>
      )}
    </div>
  );
}

export function FieldSpreadSection({
  embedded = false,
  profile,
  loading,
  error,
  category,
  onCategoryChange,
}: RoundAnalyticsProps) {
  const spread = profile?.fieldSpread;
  const round = profile?.round;
  return (
    <div
      className={`${styles.sectionBlock} ${embedded ? styles.embeddedAnalytics : ""}`}
    >
      {embedded ? (
        <PanelHeader
          title="// Field Spread"
          info="Time differences between consecutive thresholds: podium P3, then approximately 16.7%, 33.3% and 66.7% of classified finishers. Duplicate and podium-level thresholds are omitted."
        />
      ) : (
        <SectionHeader
          title="Field Spread"
          meta={[
            classCode(round),
            `Round ${round?.roundNumber ?? "--"}`,
            `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`,
          ]}
          description="Time differences between consecutive position thresholds in the final"
        />
      )}
      <Panel
        padding="none"
        className={`${styles.homePanel} ${styles.analyticsPanel}`}
      >
        <div className={styles.speedChartHeader}>
          <div>
            <strong>Race Gaps</strong>
            <span>
              Each bar shows the gap from the previous position threshold
            </span>
          </div>
          {!embedded && (
            <CategorySelector value={category} onChange={onCategoryChange} />
          )}
        </div>
        {loading ? (
          <AnalyticsBarChartSkeleton rows={4} label="Loading Field Spread" />
        ) : error || !spread || spread.points.length === 0 ? (
          <TableFeedbackState type={error ? "error" : "empty"} />
        ) : (
          <AnalyticsBarChart
            points={spread.points
              .filter(
                (point) =>
                  point.incrementalSpread != null &&
                  point.incrementalSpreadPercent != null,
              )
              .map((point) => ({
                label: `P${point.position}`,
                value: Math.min(100, point.incrementalSpreadPercent! * 12),
                detail: `${point.previousPosition === 1 ? "Winner" : `P${point.previousPosition}`} → P${point.position}: ${point.incrementalSpread!.toFixed(3)} s`,
                color: "var(--color-chart-pre-final)",
              }))}
          />
        )}
      </Panel>
      {!embedded && (
        <SectionAction
          to={
            round
              ? `${routes.round(round.roundId)}?tab=analyze`
              : routes.results
          }
        >
          Explore Round Analysis
        </SectionAction>
      )}
    </div>
  );
}
