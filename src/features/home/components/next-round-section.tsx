import { TableFeedbackState } from "../../../components/feedback/states";
import { Panel } from "../../../components/ui/panel";
import { routes } from "../../../config/routes";
import { EventClassBadge } from "../../../components/data-display/event-class-badge";
import { formatDateRange, formatOneDecimal } from "../../../utils/formatters";
import type { HomeSummary } from "../api/get-home-data";
import styles from "../../../components/analytics/home-sections.module.css";
import {
  SectionAction,
  SectionHeader,
} from "../../../components/analytics/section-controls";
import { classCode } from "../../../components/analytics/round-label";
import { Scaffold } from "./home-section-shared";

export function NextRoundSection({
  summary,
  loading,
  error = false,
  nextSeason,
}: {
  summary?: HomeSummary;
  loading: boolean;
  error?: boolean;
  nextSeason?: number;
}) {
  const round = summary?.nextRound;
  const upcomingSeason =
    nextSeason ??
    (summary?.lastCompletedRound?.season ?? summary?.season ?? 0) + 1;
  if (!loading && (error || (summary && !round))) {
    return (
      <div className={styles.sectionBlock}>
        <SectionHeader
          title="Next Round"
          meta={
            error
              ? [summary?.season ?? "----"]
              : [
                  summary?.season ?? "----",
                  "Season over",
                  `See you ${upcomingSeason}`,
                ]
          }
          description="The next round of the current season"
        />
        <Panel className={styles.homePanel}>
          {error ? (
            <TableFeedbackState type="error" />
          ) : (
            <p className={styles.seasonFinished}>
              <span aria-hidden="true">// </span>
              Season over, see you {upcomingSeason}
              <span aria-hidden="true"> //</span>
            </p>
          )}
        </Panel>
        <SectionAction to={routes.results}>See Full Calendar</SectionAction>
      </div>
    );
  }
  return (
    <div className={styles.sectionBlock}>
      <SectionHeader
        title="Next Round"
        meta={[
          loading ? <Scaffold compact /> : classCode(round),
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
                <EventClassBadge
                  className={styles.classBadge}
                  code={round?.competitionClassCode}
                  name={round?.competitionClassName}
                  abbreviation={round?.competitionClassAbbreviation}
                />
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
