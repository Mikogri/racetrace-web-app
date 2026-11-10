import { PerformanceValue } from "../../../components/data-display/performance-value";
import { RatingValue } from "../../../components/data-display/rating-value";
import riderCellStyles from "../../../components/data-display/rider-cell.module.css";
import { TableFeedbackState } from "../../../components/feedback/states";
import { RiderLink } from "../../../components/navigation/rider-navigation";
import { Panel } from "../../../components/ui/panel";
import { routes } from "../../../config/routes";
import riderRed from "../../../assets/riders/rider-red.png";
import { formatCategoryLabel } from "../../../utils/categories";
import { normalizeDisplayName } from "../../../utils/display-name";
import type { HomeSummary } from "../api/get-home-data";
import styles from "../../../components/analytics/home-sections.module.css";
import {
  CategorySelector,
  SectionAction,
  SectionHeader,
} from "../../../components/analytics/section-controls";
import { Scaffold } from "./home-section-shared";

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
                <div className={styles.topRatedListItem} key={item.riderId}>
                  <span
                    className={index === 0 ? styles.topRatedFirst : undefined}
                  >
                    {item.position}
                  </span>
                  <span className={styles.topRatedListIdentity}>
                    <strong>
                      <RiderLink
                        riderId={item.riderId}
                        className={riderCellStyles.name}
                      >
                        {normalizeDisplayName(item.fullName)}
                      </RiderLink>
                    </strong>
                    <small>
                      {item.teamName
                        ? normalizeDisplayName(item.teamName)
                        : "--"}
                    </small>
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
