import { useId, useRef } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErrorState, TableFeedbackState } from "../../../components/feedback/states";
import { ChartTooltip } from "../../../components/overlays/tooltip";
import { Panel, PanelHeader } from "../../../components/ui/panel";
import tableStyles from "../../../components/data-display/data-table.module.css";
import { useRoundProfile, type RoundProfile } from "../../home/api/get-home-data";
import { FieldSpreadSection, SpeedVsRunTimeSection, TrackFingerprintSection } from "../../home/components/home-sections";
import chartStyles from "../../home/components/home-sections.module.css";
import styles from "./round-analysis.module.css";
import { RoundRaceSections } from "./round-race-sections";
import sectionStyles from "./round-race-sections.module.css";

function FieldProgression({ points, fullPosition, loading }: { points: RoundProfile["trackFingerprint"]["positionSpread"]; fullPosition: number; loading: boolean }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const lastPosition = points.at(-1)?.position ?? 0;
  const gradientId = useId();
  const description = `Time difference from the previous position threshold, in seconds.${!loading && lastPosition > 0 && fullPosition > lastPosition ? ` Outlying tail hidden: showing through P${lastPosition} of P${fullPosition}.` : ""}`;
  return <Panel className={sectionStyles.section}>
    <PanelHeader title="// Field Progression" info={description} />
    {loading ? <div className={sectionStyles.skeleton} role="status" aria-label="Loading Field Progression"><span /></div> : points.length === 0 ? <TableFeedbackState type="empty" compact /> :
      <div ref={chartRef} className={sectionStyles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 18, right: 24, bottom: 8, left: 4 }} accessibilityLayer={false}>
            <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-pre-final)" stopOpacity={0.2} />
              <stop offset="62%" stopColor="var(--color-chart-pre-final)" stopOpacity={0.08} />
              <stop offset="100%" stopColor="var(--color-chart-pre-final)" stopOpacity={0} />
            </linearGradient></defs>
            <CartesianGrid className={chartStyles.speedGrid} />
            <XAxis dataKey="position" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(value: number) => `P${value}`} allowDecimals={false} tickLine={false} axisLine={false} tick={{ className: chartStyles.speedTick }} />
            <YAxis domain={[0, "auto"]} tickLine={false} axisLine={false} width={48} tick={{ className: chartStyles.speedTick }} />
            <Tooltip cursor={false} isAnimationActive={false} content={({ active, payload, coordinate }) => {
              const point = payload?.[0]?.payload as (typeof points)[number] | undefined;
              if (!active || !point || point.incrementalSpread == null) return null;
              return <ChartTooltip active={active} coordinate={coordinate} containerRef={chartRef}
                label={`${point.previousPosition === 1 ? "Winner" : `P${point.previousPosition}`} → P${point.position}`}
                content={`${point.incrementalSpread.toFixed(3)} s`} />;
            }} />
            <Area dataKey="incrementalSpread" type="linear" stroke="var(--color-chart-pre-final)" fill={`url(#${gradientId})`} fillOpacity={1} strokeWidth={1} dot={false} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>}
  </Panel>;
}

export function RoundAnalysis({ roundId, season, category, onCategoryChange }: {
  roundId: string; season: number; category: string; onCategoryChange: (value: string) => void;
}) {
  const query = useRoundProfile(season, category, roundId);
  const profile = query.data;
  const updating = query.isFetching && !query.isPending;
  if (query.isError && !profile) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;
  const shared = { ...(profile ? { profile } : {}), loading: query.isPending, error: query.isError, category, onCategoryChange, embedded: true };
  return <div className={styles.wrapper} aria-busy={query.isFetching}>
    {updating && <div className={tableStyles.tableProgress} role="progressbar" aria-label="Updating round analysis"><span /></div>}
    <div className={`${styles.content} ${updating ? styles.updating : ""}`}>
      <div className={sectionStyles.sections}>
      <SpeedVsRunTimeSection round={profile?.round ?? null} results={(profile?.results ?? []).map((rider) => ({ ...rider, finalTime: rider.raceTime, isPerfectRun: false }))}
        loading={query.isPending} updating={false} category={category} onCategoryChange={onCategoryChange} embedded />
      <FieldSpreadSection {...shared} />
      <TrackFingerprintSection {...shared} />
      <FieldProgression points={profile?.trackFingerprint.positionSpread ?? []} fullPosition={profile?.trackFingerprint.positionSpreadFullPosition ?? 0} loading={query.isPending} />
      </div>
      <RoundRaceSections data={profile?.analytics ?? null} loading={query.isPending} />
    </div>
  </div>;
}
