import {
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
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
import { Link } from "react-router-dom";
import {
  DataTable,
  DataTableHeader,
  RiderTableRow,
} from "../../../components/data-display/data-table";
import { PerformanceValue } from "../../../components/data-display/performance-value";
import { RatingValue } from "../../../components/data-display/rating-value";
import { RiderCell } from "../../../components/data-display/rider-cell";
import riderCellStyles from "../../../components/data-display/rider-cell.module.css";
import { TableFeedbackState } from "../../../components/feedback/states";
import { RiderLink } from "../../../components/navigation/rider-navigation";
import {
  AppTooltip,
  ChartTooltip,
} from "../../../components/overlays/tooltip";
import { Panel, PanelHeader } from "../../../components/ui/panel";
import { routes } from "../../../config/routes";
import riderRed from "../../../assets/riders/rider-red.png";
import type { RiderSummary } from "../../../types/domain";
import {
  formatCategoryLabel,
  useKnownCategories,
} from "../../../utils/categories";
import { formatCountryName } from "../../../utils/countries";
import { formatCompetitionClassAbbreviation } from "../../../utils/competition-classes";
import { EventClassBadge } from "../../../components/data-display/event-class-badge";
import { normalizeDisplayName } from "../../../utils/display-name";
import {
  formatDateRange,
  formatGap,
  formatOneDecimal,
  formatRaceTime,
} from "../../../utils/formatters";
import type {
  HomePrediction,
  HomeSummary,
  RoundProfile,
} from "../api/get-home-data";
import styles from "./home-sections.module.css";

function Scaffold({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`${styles.scaffold} ${compact ? styles.scaffoldCompact : ""}`}
      aria-hidden="true"
    />
  );
}

function TableFallbackRows({
  columns,
  loading,
  rows = 5,
}: {
  columns: number;
  loading: boolean;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: loading ? rows : 1 }, (_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }, (_, columnIndex) => (
            <td key={columnIndex}>{loading ? <Scaffold compact /> : "--"}</td>
          ))}
        </tr>
      ))}
    </>
  );
}

function rider(row: {
  riderId: string;
  fullName: string;
  teamName: string | null;
  countryCode: string | null;
}): RiderSummary {
  return {
    id: row.riderId,
    name: row.fullName,
    team: row.teamName,
    country: row.countryCode,
    category: null,
    profileImageUrl: null,
  };
}

function SectionHeader({
  title,
  meta,
  description,
}: {
  title: string;
  meta: Array<ReactNode>;
  description: string;
}) {
  return (
    <header className={styles.sectionHeader}>
      <h2>{title}</h2>
      <div className={styles.sectionMeta}>
        {meta.map((item, index) => (
          <Fragment key={index}>
            <span className={styles.metaSlash}>//</span>
            <span>{item}</span>
          </Fragment>
        ))}
      </div>
      <p>{description}</p>
    </header>
  );
}

function SectionAction({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className={styles.sectionAction} to={to}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function isJuniorCategory(value: string, label: string) {
  const descriptor = `${value} ${label}`.replaceAll("_", " ");
  if (/\bjunior\b/i.test(descriptor)) return true;
  const ageLimit = descriptor.match(/\b(?:u|under)\s*-?\s*(\d{1,2})\b/i);
  return ageLimit ? Number(ageLimit[1]) <= 19 : false;
}

function CategorySelector({
  value,
  onChange,
  compact = false,
  excludeJunior = false,
}: {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  excludeJunior?: boolean;
}) {
  const categories = useKnownCategories();
  const visibleCategories = excludeJunior
    ? categories.filter(
        (category) => !isJuniorCategory(category.value, category.label),
      )
    : categories;

  useEffect(() => {
    if (
      visibleCategories.length > 0 &&
      !visibleCategories.some((category) => category.value === value)
    )
      onChange(visibleCategories[0].value);
  }, [onChange, value, visibleCategories]);

  return (
    <div
      className={`${styles.categorySelector} ${compact ? styles.categorySelectorCompact : ""}`}
      role="group"
      aria-label="Result category"
    >
      {visibleCategories.map((category) => {
        const button = (
          <button
            type="button"
            aria-pressed={value === category.value}
            aria-label={category.label}
            onClick={() => onChange(category.value)}
          >
            {compact ? category.abbreviation : category.label}
          </button>
        );

        return compact ? (
          <AppTooltip content={category.label} key={category.value}>
            {button}
          </AppTooltip>
        ) : (
          <Fragment key={category.value}>{button}</Fragment>
        );
      })}
    </div>
  );
}

const classCode = (round: HomeSummary["nextRound"] | undefined) =>
  formatCompetitionClassAbbreviation({
    abbreviation: round?.competitionClassAbbreviation,
    code: round?.competitionClassCode,
    name: round?.competitionClassName,
  });

export function NextRoundSection({
  summary,
  loading,
}: {
  summary?: HomeSummary;
  loading: boolean;
}) {
  const round = summary?.nextRound;
  return (
    <div className={styles.sectionBlock}>
      <SectionHeader
        title="Next Round"
        meta={[
          loading ? (
            <Scaffold compact />
          ) : (
            classCode(round)
          ),
          loading ? (
            <Scaffold compact />
          ) : (
            `Round ${round?.roundNumber ?? "--"}`
          ),
          loading ? (
            <Scaffold compact />
          ) : (
            `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`
          ),
        ]}
        description="The next round of the current season"
      />
      <Panel padding="none" className={styles.homePanel}>
        <div className={styles.roundHeader}>
          <div>
            <div className={styles.roundName}>
              <strong>
                {loading ? (
                  <Scaffold />
                ) : (
                  (round?.venueName ?? round?.trackName ?? "--")
                )}
              </strong>
              {loading ? (
                <Scaffold compact />
              ) : (
                <EventClassBadge className={styles.classBadge} code={round?.competitionClassCode} name={round?.competitionClassName} abbreviation={round?.competitionClassAbbreviation} />
              )}
            </div>
            <span>
              {loading ? (
                <Scaffold compact />
              ) : round ? (
                `${round.trackName ?? "--"}, ${round.countryCode ?? "--"}`
              ) : (
                "--, --"
              )}
            </span>
          </div>
          <div className={styles.roundDate}>
            <span>
              {loading ? (
                <Scaffold compact />
              ) : (
                `Round ${round?.roundNumber ?? "--"}`
              )}
            </span>
            <strong>
              {loading ? (
                <Scaffold />
              ) : round ? (
                formatDateRange(round.startDate, round.endDate)
              ) : (
                "--"
              )}
            </strong>
          </div>
        </div>
        <div className={styles.roundStats}>
          <div>
            <span>Status</span>
            <strong>
              {loading ? <Scaffold compact /> : (round?.status ?? "--")}
            </strong>
          </div>
          <div>
            <span>Live Timing</span>
            <strong>
              {loading ? <Scaffold compact /> : round ? "Available" : "--"}
            </strong>
          </div>
          <div>
            <span>Length</span>
            <strong>
              {loading ? (
                <Scaffold compact />
              ) : round?.trackLengthMeters ? (
                `${Math.round(round.trackLengthMeters)} m`
              ) : (
                "--"
              )}
            </strong>
          </div>
          <div>
            <span>Avg Slope</span>
            <strong>
              {loading ? (
                <Scaffold compact />
              ) : round?.averageSlope == null ? (
                "--"
              ) : (
                `${formatOneDecimal(round.averageSlope)}%`
              )}
            </strong>
          </div>
        </div>
      </Panel>
      <SectionAction to={routes.results}>See Full Calendar</SectionAction>
    </div>
  );
}

export function LastRoundResultsSection({
  summary,
  loading,
  error,
  category,
  onCategoryChange,
}: {
  summary?: HomeSummary;
  loading: boolean;
  error: boolean;
  category: string;
  onCategoryChange: (value: string) => void;
}) {
  const results = summary?.lastRoundResults ?? [];
  const round = summary?.lastCompletedRound;
  return (
    <div className={styles.sectionBlock}>
      <SectionHeader
        title="Last Round Results"
        meta={[
          classCode(round),
          `Round ${round?.roundNumber ?? "--"}`,
          `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`,
        ]}
        description="Results from the last round of the current season"
      />
      <Panel
        padding="none"
        className={`${styles.homePanel} ${styles.lastResultsPanel}`}
      >
        <div
          className={`${styles.panelHeader} ${styles.lastResultsPanelHeader}`}
        >
          <div className={styles.lastResultsText}>
            <div className={styles.lastResultsHeading}>
              <strong>{`${formatCountryName(round?.countryCode)}, ${round?.venueName ?? round?.trackName ?? "--"}`}</strong>
              <EventClassBadge className={styles.classBadge} code={round?.competitionClassCode} name={round?.competitionClassName} abbreviation={round?.competitionClassAbbreviation} />
            </div>
            <span className={styles.lastResultsDate}>
              {round ? formatDateRange(round.startDate, round.endDate) : "--"}
            </span>
          </div>
          <CategorySelector value={category} onChange={onCategoryChange} />
        </div>
        <DataTable embedded className={styles.lastResultsTable}>
          <DataTableHeader>
            <tr>
              <th>
                <span className="srOnly">Position</span>
              </th>
              <th data-column="rider">Rider</th>
              <th>Time</th>
              <th>Gap</th>
            </tr>
          </DataTableHeader>
          <tbody
            className={
              !loading && results.length > 0 ? styles.homeDataLoaded : undefined
            }
          >
            {loading ? (
              <TableFallbackRows columns={4} loading={loading} />
            ) : error ? (
              <tr>
                <td className={styles.homeTableFeedbackCell} colSpan={4}>
                  <TableFeedbackState type="error" />
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td className={styles.homeTableFeedbackCell} colSpan={4}>
                  <TableFeedbackState type="empty" />
                </td>
              </tr>
            ) : (
              results.map((result) => (
                <RiderTableRow key={result.resultId} riderId={result.riderId}>
                  <td>{result.position}</td>
                  <td data-column="rider">
                    <RiderCell rider={rider(result)} compact />
                  </td>
                  <td>{formatRaceTime(result.time)}</td>
                  <td
                    className={
                      result.gapToLeader === 0 ? styles.winner : undefined
                    }
                  >
                    {formatGap(result.gapToLeader)}
                  </td>
                </RiderTableRow>
              ))
            )}
          </tbody>
        </DataTable>
      </Panel>
      <SectionAction to={round ? routes.round(round.roundId) : routes.results}>
        See Full Results
      </SectionAction>
    </div>
  );
}

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
  summary?: HomeSummary;
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
        ? [{
            riderId: result.riderId,
            name: normalizeDisplayName(result.fullName),
            position: result.position,
            time: result.finalTime,
            topSpeed: result.topSpeed,
          }]
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
      timeDomainMinimum +
      ((timeDomainMaximum - timeDomainMinimum) * index) / 4,
  );
  const minimumSpeed = speeds.length > 0 ? Math.min(...speeds) : 0;
  const maximumSpeed = speeds.length > 0 ? Math.max(...speeds) : 100;
  const speedPadding = Math.max((maximumSpeed - minimumSpeed) * 0.12, 1);

  return (
    <div className={`${styles.sectionBlock} ${embedded ? styles.embeddedAnalytics : ""}`}>
      {embedded ? <PanelHeader title="// Top Speed vs Run Time" info="Final run time compared with top speed. Faster runs appear further to the right." /> : <SectionHeader
        title="Top Speed vs Run Time"
        meta={[
          classCode(round),
          `Round ${round?.roundNumber ?? "--"}`,
          `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`,
        ]}
        description="Final run time compared with each rider's top speed"
      />}
      <Panel padding="none" className={`${styles.homePanel} ${styles.speedPanel}`}>
        <div className={styles.speedChartHeader}>
          <div>
            <strong>Final Performance</strong>
            <span>Shorter run times are shown further to the right</span>
          </div>
          {!embedded && <CategorySelector value={category} onChange={onCategoryChange} />}
        </div>
        {loading ? (
          <div className={styles.speedChartSkeleton} aria-label="Loading final performance chart">
            <span aria-hidden="true" />
          </div>
        ) : (
          <div
            ref={chartRef}
            className={`${styles.speedChart} ${updating ? styles.speedChartUpdating : ""}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 18, right: 42, bottom: 8, left: 4 }} accessibilityLayer={false}>
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
                  domain={[minimumSpeed - speedPadding, maximumSpeed + speedPadding]}
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
                    const point = payload?.[0]?.payload as (typeof points)[number] | undefined;
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
                    const item = properties as { cx?: number; cy?: number; payload?: (typeof points)[number] };
                    const color = item.payload?.position === 1
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
                    const item = properties as { cx?: number; cy?: number; payload?: (typeof points)[number] };
                    const color = item.payload?.position === 1
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
                        style={{ "--speed-point-color": color } as CSSProperties}
                      />
                    );
                  }}
                  isAnimationActive
                  animationDuration={300}
                >
                  {points.map((point, index) => {
                    const color = point.position === 1
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
      {!embedded && <SectionAction to={round ? routes.round(round.roundId) : routes.results}>
        See Round Details
      </SectionAction>}
    </div>
  );
}

function AnalyticsBarChartSkeleton({ rows, label }: { rows: number; label: string }) {
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
  points: Array<{ label: string; value: number; detail: string; color: string }>;
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
              const point = payload?.[0]?.payload as { label: string; detail: string } | undefined;
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
    <div className={`${styles.sectionBlock} ${embedded ? styles.embeddedAnalytics : ""}`}>
      {embedded ? <PanelHeader title="// Track Fingerprint" info="How strongly each sector separated the field in the final." /> : <SectionHeader
        title="Track Fingerprint"
        meta={[classCode(round), `Round ${round?.roundNumber ?? "--"}`, `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`]}
        description="How strongly each sector separated the field in the final"
      />}
      <Panel padding="none" className={`${styles.homePanel} ${styles.analyticsPanel}`}>
        <div className={styles.speedChartHeader}>
          <div><strong>Sector Impact</strong><span>Relative influence on the final result</span></div>
          {!embedded && <CategorySelector value={category} onChange={onCategoryChange} />}
        </div>
        {loading ? (
          <AnalyticsBarChartSkeleton rows={fingerprint.length || 5} label="Loading Track Fingerprint" />
        ) : error || fingerprint.length === 0 ? (
          <TableFeedbackState type={error ? "error" : "empty"} />
        ) : (
          <AnalyticsBarChart points={fingerprint.map((sector) => ({
            label: sector.label,
            value: sector.decisiveness,
            detail: `${formatOneDecimal(sector.relativeImpact)}% relative impact · ${sector.ridersCount} riders`,
            color: "var(--color-brand-primary)",
          }))} />
        )}
      </Panel>
      {children}
      {!embedded && <SectionAction to={round ? `${routes.round(round.roundId)}?tab=analyze` : routes.results}>Explore Round Analysis</SectionAction>}
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
    <div className={`${styles.sectionBlock} ${embedded ? styles.embeddedAnalytics : ""}`}>
      {embedded ? <PanelHeader title="// Field Spread" info="Time differences between consecutive thresholds: podium P3, then approximately 16.7%, 33.3% and 66.7% of classified finishers. Duplicate and podium-level thresholds are omitted." /> : <SectionHeader
        title="Field Spread"
        meta={[classCode(round), `Round ${round?.roundNumber ?? "--"}`, `${round?.venueName ?? round?.trackName ?? "--"}, ${round?.countryCode ?? "--"}`]}
        description="Time differences between consecutive position thresholds in the final"
      />}
      <Panel padding="none" className={`${styles.homePanel} ${styles.analyticsPanel}`}>
        <div className={styles.speedChartHeader}>
          <div><strong>Race Gaps</strong><span>Each bar shows the gap from the previous position threshold</span></div>
          {!embedded && <CategorySelector value={category} onChange={onCategoryChange} />}
        </div>
        {loading ? (
          <AnalyticsBarChartSkeleton rows={4} label="Loading Field Spread" />
        ) : error || !spread || spread.points.length === 0 ? (
          <TableFeedbackState type={error ? "error" : "empty"} />
        ) : (
          <AnalyticsBarChart points={spread.points.filter((point) => point.incrementalSpread != null && point.incrementalSpreadPercent != null).map((point) => ({
            label: `P${point.position}`,
            value: Math.min(100, point.incrementalSpreadPercent! * 12),
            detail: `${point.previousPosition === 1 ? "Winner" : `P${point.previousPosition}`} → P${point.position}: ${point.incrementalSpread!.toFixed(3)} s`,
            color: "var(--color-chart-pre-final)",
          }))} />
        )}
      </Panel>
      {!embedded && <SectionAction to={round ? `${routes.round(round.roundId)}?tab=analyze` : routes.results}>Explore Round Analysis</SectionAction>}
    </div>
  );
}


export function PodiumPredictorSection({
  prediction,
  loading,
  error,
  category,
  onCategoryChange,
}: {
  prediction?: HomePrediction;
  loading: boolean;
  error: boolean;
  category: string;
  onCategoryChange: (value: string) => void;
}) {
  const items = prediction?.items ?? [];
  const round = prediction?.round;
  return (
    <div className={styles.sectionBlock}>
      <SectionHeader
        title="Podium Predictor"
        meta={[
          classCode(round),
          `Round ${round?.roundNumber ?? "--"}`,
          `${round?.trackName ?? round?.venueName ?? "--"}, ${formatCountryName(round?.countryCode)}`,
        ]}
        description="Predict podium for the next round."
      />
      <Panel className={`${styles.homePanel} ${styles.podiumPredictorPanel}`}>
        <div className={styles.lastResultsText}>
          <div className={styles.lastResultsHeading}>
            <strong>{`${formatCountryName(round?.countryCode)}, ${round?.trackName ?? round?.venueName ?? "--"}`}</strong>
            <EventClassBadge className={styles.classBadge} code={round?.competitionClassCode} name={round?.competitionClassName} abbreviation={round?.competitionClassAbbreviation} />
          </div>
          <span className={styles.lastResultsDate}>
            Higher means more likely to get on podium
          </span>
        </div>
        <CategorySelector
          value={category}
          onChange={onCategoryChange}
          excludeJunior
        />
        <div
          className={`${styles.podiumItems} ${!loading && items.length > 0 ? styles.homeDataLoaded : ""}`}
        >
          {loading ? (
            Array.from({ length: 5 }, (_, index) => (
              <div className={styles.podiumItem} key={index}>
                <Scaffold compact />
                <div className={styles.podiumItemScaffold}>
                  <Scaffold compact />
                </div>
              </div>
            ))
          ) : error ? (
            <div className={styles.podiumFeedback}>
              <TableFeedbackState type="error" />
            </div>
          ) : items.length === 0 ? (
            <div className={styles.podiumFeedback}>
              <TableFeedbackState type="empty" />
            </div>
          ) : (
            items.slice(0, 10).map((item) => {
              const probability = Math.min(
                100,
                Math.max(0, item.podiumProbability),
              );
              return (
                <div className={styles.podiumItem} key={item.riderId}>
                  <div className={styles.podiumRider}>
                    <span>{item.position}</span>
                    <span className={styles.podiumRiderIdentity}>
                      <RiderLink
                        className={styles.podiumRiderName}
                        riderId={item.riderId}
                      >
                        {normalizeDisplayName(item.fullName)}
                      </RiderLink>
                      <small>
                        {item.teamName
                          ? normalizeDisplayName(item.teamName)
                          : "--"}
                      </small>
                    </span>
                  </div>
                  <div
                    className={styles.podiumProgressTrack}
                    role="progressbar"
                    aria-label={`${item.fullName} podium probability`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={probability}
                    style={
                      {
                        "--podium-progress": `${probability}%`,
                      } as CSSProperties
                    }
                  >
                    <span />
                    <i aria-hidden="true" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Panel>
      <SectionAction to={routes.compare}>Compare Riders</SectionAction>
    </div>
  );
}

export function TopRatedSection({
  summary,
  loading,
  error,
  category,
  onCategoryChange,
}: {
  summary?: HomeSummary;
  loading: boolean;
  error: boolean;
  category: string;
  onCategoryChange: (value: string) => void;
}) {
  const items = summary?.seasonTopRated ?? [];
  const leader = items[0];
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.topRatedHeader}>
        <SectionHeader
          title={`${summary?.season ?? "----"} Top Rated`}
          meta={[
            summary?.season ?? "----",
            `After Round ${summary?.lastCompletedRound?.roundNumber ?? "--"}`,
            formatCategoryLabel(summary?.category ?? "elite_men"),
          ]}
          description="Top rated riders of the season so far"
        />
        <CategorySelector
          compact
          value={category}
          onChange={onCategoryChange}
        />
      </div>
      <Panel
        className={`${styles.homePanel} ${styles.topRatedPanel} ${!loading && items.length > 0 ? styles.homeDataLoaded : ""}`}
      >
        <div className={styles.topRatedLeader}>
          {loading ? (
            <Scaffold />
          ) : !leader ? (
            <span className={styles.empty}>--</span>
          ) : (
            <>
              <RiderLink
                className={styles.topRatedIdentity}
                riderId={leader.riderId}
              >
                <span className={styles.topRatedName}>
                  {leader.fullName}
                  <span>{leader.countryCode ?? "--"}</span>
                </span>
                <small>{leader.teamName ?? "--"}</small>
              </RiderLink>
              <div className={styles.topRatedLeaderData}>
                <div className={styles.topRatedRiderCrop} aria-hidden="true">
                  <img
                    className={styles.topRatedRiderImage}
                    src={riderRed}
                    alt=""
                  />
                </div>
                <div className={styles.topRatedStats}>
                  <div className={styles.topRatedMainRating}>
                    <span>Rating</span>
                    <RatingValue
                      value={leader.rating}
                      className={styles.topRatedRatingValue}
                    />
                    <div className={styles.topRatedRatingBar}>
                      <span className={styles.topRatedRatingTrack}>
                        <i
                          style={{
                            width: `${Math.min(100, Math.max(0, leader.rating))}%`,
                          }}
                        />
                      </span>
                      <small>/100</small>
                    </div>
                  </div>
                  <div className={styles.topRatedParameters}>
                    <div>
                      <span>Pace</span>
                      <PerformanceValue value={leader.pace} />
                    </div>
                    <div>
                      <span>Consistency</span>
                      <PerformanceValue value={leader.consistency} />
                    </div>
                    <div>
                      <span>Confidence</span>
                      <PerformanceValue value={leader.confidence} percent />
                    </div>
                  </div>
                </div>
              </div>
              <p>Based on form, results &amp; pace</p>
            </>
          )}
        </div>
        <div className={styles.topRatedDivider} aria-hidden="true" />
        <div className={styles.topRatedList}>
          <h3>Top 5 Riders</h3>
          <div>
            {loading ? (
              Array.from({ length: 5 }, (_, index) => (
                <div className={styles.topRatedListItem} key={index}>
                  <Scaffold compact />
                </div>
              ))
            ) : error ? (
              <div className={styles.topRatedListFeedback}>
                <TableFeedbackState type="error" />
              </div>
            ) : items.length === 0 ? (
              <div className={styles.topRatedListFeedback}>
                <TableFeedbackState type="empty" />
              </div>
            ) : (
              items.slice(0, 5).map((item, index) => (
                <div
                  className={styles.topRatedListItem}
                  key={item.riderId}
                >
                  <span
                    className={index === 0 ? styles.topRatedFirst : undefined}
                  >
                    {item.position}
                  </span>
                  <span className={styles.topRatedListIdentity}>
                    <strong>
                      <RiderLink riderId={item.riderId} className={riderCellStyles.name}>
                        {normalizeDisplayName(item.fullName)}
                      </RiderLink>
                    </strong>
                    <small>{item.teamName ? normalizeDisplayName(item.teamName) : "--"}</small>
                  </span>
                  <RatingValue value={item.rating} />
                </div>
              ))
            )}
          </div>
        </div>
      </Panel>
      <SectionAction to={routes.ranking}>See Full Ranking</SectionAction>
    </div>
  );
}

export function CurrentStandingsSection({
  summary,
  loading,
  error,
  category,
  onCategoryChange,
}: {
  summary?: HomeSummary;
  loading: boolean;
  error: boolean;
  category: string;
  onCategoryChange: (value: string) => void;
}) {
  const items = summary?.currentStandings ?? [];
  return (
    <div className={styles.sectionBlock}>
      <SectionHeader
        title="Current Standings"
        meta={[
          summary?.season ?? "----",
          `After Round ${summary?.lastCompletedRound?.roundNumber ?? "--"}`,
          formatCategoryLabel(summary?.category ?? "elite_men"),
        ]}
        description="Current season standings after last round"
      />
      <CategorySelector value={category} onChange={onCategoryChange} />
      <Panel padding="none" className={styles.homePanel}>
        <DataTable embedded className={styles.currentStandingsTable}>
          <DataTableHeader>
            <tr>
              <th>#</th>
              <th data-column="rider">Rider</th>
              <th>Points</th>
            </tr>
          </DataTableHeader>
          <tbody
            className={
              !loading && items.length > 0 ? styles.homeDataLoaded : undefined
            }
          >
            {loading ? (
              <TableFallbackRows columns={3} loading={loading} rows={5} />
            ) : error ? (
              <tr>
                <td className={styles.homeTableFeedbackCell} colSpan={3}>
                  <TableFeedbackState type="error" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className={styles.homeTableFeedbackCell} colSpan={3}>
                  <TableFeedbackState type="empty" />
                </td>
              </tr>
            ) : (
              items.slice(0, 5).map((item) => (
                <RiderTableRow
                  className={styles.standingsDataRow}
                  key={item.riderId}
                  riderId={item.riderId}
                >
                  <td>{item.position}</td>
                  <td data-column="rider">
                    <RiderCell rider={rider(item)} compact />
                  </td>
                  <td className={styles.standingsPoints}>
                    {Math.round(item.points)
                      .toLocaleString("en-US")
                      .replaceAll(",", " ")}
                  </td>
                </RiderTableRow>
              ))
            )}
          </tbody>
        </DataTable>
      </Panel>
      <SectionAction to={routes.ranking}>See Full Standings</SectionAction>
    </div>
  );
}
