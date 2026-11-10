import type { CSSProperties } from "react";
import { TableFeedbackState } from "../../../components/feedback/states";
import { RiderLink } from "../../../components/navigation/rider-navigation";
import { Panel } from "../../../components/ui/panel";
import { routes } from "../../../config/routes";
import { formatCountryName } from "../../../utils/countries";
import { EventClassBadge } from "../../../components/data-display/event-class-badge";
import { normalizeDisplayName } from "../../../utils/display-name";
import type { HomePrediction } from "../api/get-home-data";
import styles from "../../../components/analytics/home-sections.module.css";
import {
  CategorySelector,
  SectionAction,
  SectionHeader,
} from "../../../components/analytics/section-controls";
import { classCode } from "../../../components/analytics/round-label";
import { Scaffold } from "./home-section-shared";

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
            <EventClassBadge
              className={styles.classBadge}
              code={round?.competitionClassCode}
              name={round?.competitionClassName}
              abbreviation={round?.competitionClassAbbreviation}
            />
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
