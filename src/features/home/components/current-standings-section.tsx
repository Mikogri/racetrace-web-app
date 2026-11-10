import {
  DataTable,
  DataTableHeader,
  RiderTableRow,
} from "../../../components/data-display/data-table";
import { TableFeedbackState } from "../../../components/feedback/states";
import { Panel } from "../../../components/ui/panel";
import { routes } from "../../../config/routes";
import { formatCategoryLabel } from "../../../utils/categories";
import type { HomeSummary } from "../api/get-home-data";
import styles from "../../../components/analytics/home-sections.module.css";
import {
  CategorySelector,
  SectionAction,
  SectionHeader,
} from "../../../components/analytics/section-controls";
import { TableFallbackRows, HomeRiderCell } from "./home-section-shared";

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
                    <HomeRiderCell row={item} />
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
