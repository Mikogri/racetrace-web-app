import { useState, type CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSeasons } from "../../components/filters/api/get-seasons";
import { useKnownCategories } from "../../utils/categories";
import {
  ErrorState,
  TableFeedbackState,
} from "../../components/feedback/states";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { routes } from "../../config/routes";
import { formatDateRange } from "../../utils/formatters";
import { formatCompetitionClassAbbreviation } from "../../utils/competition-classes";
import { formatDomainLabel, useDomainMetadata } from "../../utils/domain-metadata";
import { LiveStatusBadge } from "../live/components/live-status-badge";
import demoRoundImage from "../../assets/hero.png";
import roundPlaceholder from "../../assets/round-placeholder.png";
import { useRounds, type RoundListItem } from "./api/get-rounds";
import styles from "./results-page.module.css";

function competitionClassAbbreviation(round: RoundListItem) {
  return formatCompetitionClassAbbreviation({
    abbreviation: round.competitionClassAbbreviation,
    code: round.competitionClassCode,
    name: round.competitionClassName,
  });
}

function isLiveRound(status: string) {
  return ["live", "active", "running"].includes(status.trim().toLowerCase());
}

function RoundCardImage({ round }: { round: RoundListItem }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const source =
    round.imageUrl === "demo"
      ? demoRoundImage
      : `/api/v1/rounds/${encodeURIComponent(round.roundId)}/image`;

  if (failed) return <RoundImagePlaceholder />;

  return (
    <div className={styles.roundImageFrame} aria-busy={!loaded}>
      {!loaded ? (
        <span className={styles.roundImageSpinner} aria-hidden="true" />
      ) : null}
      <img
        className={`${styles.roundImage} ${loaded ? styles.roundImageLoaded : ""}`}
        src={source}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function RoundImagePlaceholder() {
  return (
    <div className={styles.imagePlaceholder} aria-hidden="true">
      <img src={roundPlaceholder} alt="" />
    </div>
  );
}

export default function ResultsPage() {
  useDomainMetadata();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFirstRequest, setIsFirstRequest] = useState(true);
  const [preserveErrorDuringUpdate, setPreserveErrorDuringUpdate] =
    useState(false);
  const categories = useKnownCategories();
  const seasonsQuery = useSeasons();
  const requestedSeason = Number(searchParams.get("season"));
  const season =
    Number.isInteger(requestedSeason) && requestedSeason >= 1990
      ? requestedSeason
      : new Date().getUTCFullYear();
  const roundsQuery = useRounds({ season, page: 1 });
  const rounds = roundsQuery.data?.items ?? [];
  const roundCount = roundsQuery.data?.totalItems
    ? roundsQuery.data.totalItems
    : undefined;
  const categoryCount = roundsQuery.data?.items.length
    ? categories.length || undefined
    : undefined;
  const isInitialLoading = roundsQuery.isPending && isFirstRequest;
  const isUpdating = roundsQuery.isFetching && !isInitialLoading;
  const displayError =
    roundsQuery.isError || (isUpdating && preserveErrorDuringUpdate);
  const showFullPageFeedback = isInitialLoading || displayError;
  const seasons = seasonsQuery.data?.items ?? [];
  const seasonOptions = seasonsQuery.isError
    ? []
    : seasons.map((value) => ({ value: String(value), label: String(value) }));
  const selectedSeasonIndex = seasonOptions.findIndex(
    (option) => option.value === String(season),
  );
  const contentClassName = [
    styles.resultsContent,
    showFullPageFeedback ? styles.feedbackSection : undefined,
    isUpdating ? styles.updatingContent : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const update = (key: string, value: string | null) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        return next;
      },
      { replace: true },
    );

  const changeSeason = (value: string) => {
    if (value === String(season)) return;
    setIsFirstRequest(false);
    setPreserveErrorDuringUpdate(roundsQuery.isError);
    update("season", value);
  };

  const retry = () => {
    setPreserveErrorDuringUpdate(true);
    void roundsQuery.refetch();
  };

  return (
    <PageContainer
      className={showFullPageFeedback ? styles.feedbackPage : undefined}
    >
      <PageHeader
        title={`${Number.isInteger(season) ? season : "----"} Season`}
        eyebrow={`${Number.isInteger(season) ? season : "----"} Season / ${roundCount ?? "-"} Rounds / ${categoryCount ?? "-"} Categories`}
        description="A complete view of the World Cup & World Champs calendar. Browse every downhill round, track dates locations, and open an event to explore its results."
      />
      <div className={styles.filterSection}>
        <nav
          className={styles.seasonMenu}
          aria-label="Season"
          style={
            {
              "--season-indicator-offset": `${selectedSeasonIndex * 54}px`,
            } as CSSProperties
          }
        >
          {selectedSeasonIndex >= 0 ? <span className={styles.seasonIndicator} aria-hidden="true" /> : null}
          {seasonsQuery.isPending ? (
            Array.from({ length: 4 }, (_, index) => (
              <span className={styles.seasonSkeleton} aria-hidden="true" key={index} />
            ))
          ) : seasonsQuery.isError ? (
            Array.from({ length: 4 }, (_, index) => (
              <button
                className={styles.seasonMenuItem}
                type="button"
                disabled
                aria-label="Season unavailable"
                key={`unavailable-season-${index}`}
              >
                ----
              </button>
            ))
          ) : seasonOptions.map((option) => {
            const availableSeason = Number(option.value);
            const value = String(availableSeason);
            const isSelected = availableSeason === season;
            return (
              <button
                className={`${styles.seasonMenuItem} ${isSelected ? styles.seasonMenuItemActive : ""}`}
                type="button"
                aria-current={isSelected ? "page" : undefined}
                onClick={() => changeSeason(value)}
                key={value}
              >
                {value}
              </button>
            );
          })}
        </nav>
        {isUpdating ? (
          <div
            className={styles.dataProgress}
            role="progressbar"
            aria-label="Loading rounds"
          >
            <span />
          </div>
        ) : null}
      </div>
      <Section className={contentClassName}>
        {displayError ? (
          <ErrorState
            message={roundsQuery.error?.message ?? "Unable to load rounds."}
            onRetry={retry}
          />
        ) : isInitialLoading ? (
          <TableFeedbackState type="loading" />
        ) : (
          <>
            {roundsQuery.data && roundsQuery.data.items.length === 0 ? (
              <TableFeedbackState type="empty" />
            ) : null}
            {rounds.length > 0 ? (
              <>
                <div className={styles.roundGrid}>
                  {rounds.map((round, index) => (
                    <Link
                      className={`${styles.roundCard} ${!isUpdating ? styles.roundCardEnter : ""} ${round.status === "upcoming" || round.status === "scheduled" ? styles.upcomingCard : ""}`}
                      style={
                        {
                          "--card-enter-delay": `${index * 150}ms`,
                        } as CSSProperties
                      }
                      to={
                        isLiveRound(round.status)
                          ? routes.liveRound(round.roundId, round.season)
                          : routes.round(round.roundId)
                      }
                      key={round.roundId}
                      aria-disabled={
                        round.status === "upcoming" ||
                        round.status === "scheduled"
                      }
                      tabIndex={
                        round.status === "upcoming" ||
                        round.status === "scheduled"
                          ? -1
                          : undefined
                      }
                      onClick={
                        round.status === "upcoming" ||
                        round.status === "scheduled"
                          ? (event) => event.preventDefault()
                          : undefined
                      }
                    >
                      {round.status === "upcoming" ||
                      round.status === "scheduled" ? (
                        <div className={styles.upcomingCover}>
                          <span className={styles.upcomingNumber}>
                            {String(round.roundNumber ?? "--").padStart(2, "0")}
                          </span>
                          <span className={styles.upcomingVenue}>
                            {round.venueName ?? round.trackName ?? "--"}
                          </span>
                          <span className={styles.upcomingLabel}>Upcoming</span>
                        </div>
                      ) : round.imageUrl ? (
                        <RoundCardImage round={round} />
                      ) : (
                        <RoundImagePlaceholder />
                      )}
                      <div className={styles.roundBody}>
                        <div className={styles.roundInfo}>
                          <p className={styles.roundMeta}>
                            Round{" "}
                            {String(round.roundNumber ?? "--").padStart(2, "0")}{" "}
                            // {round.trackName ?? round.venueName ?? "--"},{" "}
                            {round.countryCode ?? "--"}
                          </p>
                          <h2>
                            {round.venueName ??
                              round.trackName ??
                              `Round ${round.roundId}`}
                          </h2>
                          <p className={styles.roundDate}>
                            {formatDateRange(round.startDate, round.endDate)}
                          </p>
                        </div>
                        <div className={styles.cardDivider} />
                        <div className={styles.cardFooter}>
                          {isLiveRound(round.status) ? (
                            <LiveStatusBadge status={round.status} domain="roundStatuses" />
                          ) : (
                            <span
                              className={`${styles.roundStatus} ${round.status === "upcoming" || round.status === "scheduled" ? styles.upcomingStatus : ""}`}
                            >
                              //{" "}
                              {formatDomainLabel("roundStatuses", round.status, round.status === "scheduled"
                                ? "upcoming"
                                : round.status).toLowerCase()}
                            </span>
                          )}
                          <span
                            className={`${styles.classBadge} ${round.competitionClassCode === "world_championship" ? styles.worldChampionship : styles.worldCup}`}
                          >
                            {competitionClassAbbreviation(round)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </Section>
    </PageContainer>
  );
}
