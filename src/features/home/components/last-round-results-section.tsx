import {
  DataTable,
  DataTableHeader,
  RiderTableRow,
} from "../../../components/data-display/data-table";
import { TableFeedbackState } from "../../../components/feedback/states";
import { Panel } from "../../../components/ui/panel";
import { routes } from "../../../config/routes";
import { formatCountryName } from "../../../utils/countries";
import { EventClassBadge } from "../../../components/data-display/event-class-badge";
import {
  formatDateRange,
  formatGap,
  formatRaceTime,
} from "../../../utils/formatters";
import type { HomeSummary } from "../api/get-home-data";
import styles from "../../../components/analytics/home-sections.module.css";
import {
  CategorySelector,
  SectionAction,
  SectionHeader,
} from "../../../components/analytics/section-controls";
import { classCode } from "../../../components/analytics/round-label";
import { TableFallbackRows, HomeRiderCell } from "./home-section-shared";

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
              <EventClassBadge
                className={styles.classBadge}
                code={round?.competitionClassCode}
                name={round?.competitionClassName}
                abbreviation={round?.competitionClassAbbreviation}
              />
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
                    <HomeRiderCell row={result} />
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
