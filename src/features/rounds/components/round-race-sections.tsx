import type { ReactNode } from "react";
import { TableFeedbackState } from "../../../components/feedback/states";
import { AppTooltip } from "../../../components/overlays/tooltip";
import { Panel, PanelHeader } from "../../../components/ui/panel";
import { normalizeDisplayName } from "../../../utils/display-name";
import type { RoundRaceAnalytics } from "../api/round-race-analytics-schema";
import { QualiFinalChart, RoundAnalyticsBars } from "./round-race-charts";
import styles from "./round-race-sections.module.css";

function AnalyticsSection({ title, description, loading, children }: { title: string; description: string; loading: boolean; children: ReactNode }) {
  return <Panel className={styles.section}>
    <PanelHeader title={`// ${title}`} info={description} />
    {loading ? <div className={styles.skeleton} role="status" aria-label={`Loading ${title}`}><span /></div> : children}
  </Panel>;
}

const empty = (description: string) => <TableFeedbackState type="empty" description={description} compact />;
const value = (number: number | null | undefined, digits = 1) => number == null ? "--" : number.toFixed(digits);
const signed = (number: number, digits = 3) => `${number > 0 ? "+" : ""}${number.toFixed(digits)}`;
const chaosLabels: Record<string, string> = { positionChanges: "Position changes", incidents: "Incidents", dnf: "DNF", preFinalChanges: "Pre-final changes" };

function chaosColor(score: number) {
  const bounded = Math.max(0, Math.min(100, score));
  const from = bounded <= 50 ? "success" : "warning";
  const to = bounded <= 50 ? "warning" : "error";
  const blend = bounded <= 50 ? bounded * 2 : (bounded - 50) * 2;
  return `color-mix(in srgb, var(--color-status-${from}) ${100 - blend}%, var(--color-status-${to}))`;
}

function EfficiencyValue({ label, count, percent, color }: { label: string; count: number; percent: number | null | undefined; color: string }) {
  return <dd className={styles.efficiencyValue} style={{ color }}>
    <span>{count}{percent != null && ` · ${percent.toFixed(1)}%`}</span>
    {percent != null && <span className={styles.efficiencyTrack} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <span style={{ width: `${percent}%` }} />
    </span>}
  </dd>;
}

export function RoundRaceSections({ data, loading }: { data: RoundRaceAnalytics | null; loading: boolean }) {
  const density = data?.sectorEfficiency.filter((sector) => sector.positionsPerSecond !== null) ?? [];
  const chaos = data?.chaos;
  const correlation = data?.correlation;
  const margin = data?.winningMargin;
  const run = data?.runEfficiency;
  const distribution = data?.distribution;
  return <div className={styles.sections}>
    <AnalyticsSection title="Sector Efficiency" description="Estimated positions lost per second, based on local sector-time density." loading={loading}>
      {density.length > 0 ? <>
        <RoundAnalyticsBars unit="Positions per second" data={density.map((sector) => ({
          label: `S${sector.sectorIndex}`, value: sector.positionsPerSecond!, color: "var(--color-chart-pre-final)",
          detail: `1.0 s ≈ ${value(sector.positionsPerSecond)} positions · ${sector.ridersCount} riders`,
        }))} />
      </> : empty("At least 3 valid sector times with measurable differences are needed.")}
    </AnalyticsSection>

    <AnalyticsSection title="Chaos Index" description="Heuristic 0–100: higher means more disruption. Missing components are excluded and weights rebalanced." loading={loading}>
      {chaos?.score != null ? <>
        <div className={styles.score}><strong style={{ color: chaosColor(chaos.score) }}>{value(chaos.score)}</strong><span>/ 100</span></div>
        <dl className={styles.metrics}>
          {chaos.components.map((component) => <div key={component.key}>
            <dt><AppTooltip content={`Nominal weight: ${(component.weight * 100).toFixed(0)}% · Sample: ${component.sampleSize}`}>
              {chaosLabels[component.key] ?? component.key}
            </AppTooltip></dt><dd>{value(component.score)}</dd>
          </div>)}
        </dl>
        <p className={styles.note}>{chaos.starters} starters · {chaos.dnfCount} DNF · {chaos.incidentCount} detected incidents</p>
      </> : empty("Not enough timing or pre-final evidence to measure race disruption.")}
    </AnalyticsSection>

    <AnalyticsSection title="Quali vs Final Correlation" description={`${correlation?.preFinalSession ?? "Pre-final"} → Final · matched classified riders. +1: same order · 0: no monotonic relationship · −1: reverse order.`} loading={loading}>
      {correlation?.spearman != null ? <>
        <div className={styles.summary}><span>Spearman ρ <strong>{value(correlation.spearman, 3)}</strong></span><span>{correlation.points.length} riders</span></div>
        <QualiFinalChart correlation={correlation} />
      </> : empty("At least 3 paired classified riders with distinct ranks are needed.")}
    </AnalyticsSection>

    <AnalyticsSection title="Sector Contribution to Winning Margin" description="Time gained (+) or lost (−) against P2. Contributions sum to the final margin." loading={loading}>
      {margin ? <>
        <div className={styles.summary}><span>{normalizeDisplayName(margin.winnerName)} vs {normalizeDisplayName(margin.runnerUpName)}</span><strong>{value(margin.marginSeconds, 3)} s</strong></div>
        <RoundAnalyticsBars unit="Seconds gained against P2" data={margin.sectors.map((sector) => ({
          label: `S${sector.sectorIndex}`, value: sector.gapSeconds,
          color: sector.gapSeconds < 0 ? "var(--color-sector-loss-text)" : "var(--color-sector-gain-text)",
          detail: `${signed(sector.gapSeconds)} s${sector.sharePercent == null ? "" : ` · ${signed(sector.sharePercent, 1)}% of final margin`}`,
        }))} />
      </> : empty("Complete sector times for the winner and P2 are needed.")}
    </AnalyticsSection>

    <AnalyticsSection title="Run Efficiency" description="Sector performance and concentration of positive gains over P2, before subtracting losses." loading={loading}>
      {run && run.measuredSectors > 0 ? <>
        <div className={styles.summary}><strong>{normalizeDisplayName(run.fullName)}</strong><span>{run.measuredSectors} / {run.sectorsCount} sectors measured</span></div>
        <dl className={styles.metrics}>
          <div><dt>Sectors won</dt><EfficiencyValue label="Sectors won" count={run.sectorsWon} percent={run.sectorsWonPercent} color="var(--color-status-success)" /></div>
          <div><dt>Sectors Top 3</dt><EfficiencyValue label="Sectors Top 3" count={run.sectorsTop3} percent={run.sectorsTop3Percent} color="var(--color-chart-pre-final)" /></div>
          <div><dt>Average sector position</dt><dd>{value(run.averageSectorPosition, 2)}</dd></div>
          <div><dt>Sectors for 80% of gains</dt><dd>{value(run.sectorsFor80PercentGain, 0)}</dd></div>
          {margin && margin.winnerId === run.riderId && <>
            <div><dt>Runner-up</dt><dd>{normalizeDisplayName(margin.runnerUpName)}</dd></div>
            <div><dt>Winning margin</dt><dd style={{ color: "var(--color-status-success)" }}>{value(margin.marginSeconds, 3)} s</dd></div>
          </>}
        </dl>
      </> : empty("Valid sector times for the winner are needed.")}
    </AnalyticsSection>

    <AnalyticsSection title="Performance Distribution" description={`Final Pace across the classified field. Axis labels show the upper edge of each 10-point interval; exact ranges are in the tooltips. ${distribution?.outliers.length ?? 0} outliers (1.5 × IQR). Existing Pace model; DNF/DNS/DSQ excluded.`} loading={loading}>
      {distribution && distribution.ridersCount > 0 ? <>
        <div className={styles.summary}><span>{distribution.ridersCount} / {distribution.classifiedCount} riders measured</span><span>Median <strong>{value(distribution.median)}</strong></span></div>
        <RoundAnalyticsBars unit="X: Pace · Y: Riders" integers data={distribution.bins.map((bin) => ({
          label: String(bin.to), value: bin.count, color: "var(--color-chart-rating)",
          detail: `${bin.count} riders · Pace ${bin.from} ≤ score ${bin.to === 100 ? "≤" : "<"} ${bin.to}`,
        }))} />
      </> : empty("Final Pace values for classified riders are not available.")}
    </AnalyticsSection>
  </div>;
}
