import type { CSSProperties } from "react";
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
import { Panel } from "../../../components/ui/panel";
import { routes } from "../../../config/routes";
import riderRed from "../../../assets/riders/rider-red.png";
import type { RiderSummary } from "../../../types/domain";
import { formatCategoryLabel } from "../../../utils/categories";
import { formatCountryName } from "../../../utils/countries";
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
} from "../api/get-home-data";
import styles from "../../../components/analytics/home-sections.module.css";
import { CategorySelector, SectionAction, SectionHeader } from "../../../components/analytics/section-controls";
import { classCode } from "../../../components/analytics/round-label";

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
