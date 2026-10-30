import { PageContainer, Section } from "../../components/layout/page-container";
import {
  CurrentStandingsSection,
  LastRoundResultsSection,
  NextRoundSection,
  PodiumPredictorSection,
  TopRatedSection,
} from "./components/home-sections";
import { FieldSpreadSection, TrackFingerprintSection, SpeedVsRunTimeSection } from "../../components/analytics/analytics-sections";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { seasonsQueryOptions } from "../../components/filters/api/get-seasons";
import { useSearchParams } from "react-router-dom";
import {
  useHomeRanking,
  usePodiumPredictor,
  useRoundProfile,
  useSeasonOverview,
  type HomeSummary,
} from "./api/get-home-data";
import styles from "./home-page.module.css";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const seasonValue = Number(searchParams.get("season"));
  const season =
    Number.isInteger(seasonValue) && seasonValue >= 1990
      ? seasonValue
      : new Date().getUTCFullYear();
  const initialCategory = searchParams.get("category") ?? "elite_men";
  const [lastResultsCategory, setLastResultsCategory] =
    useState(initialCategory);
  const [podiumCategory, setPodiumCategory] = useState(initialCategory);
  const [topRatedCategory, setTopRatedCategory] = useState(initialCategory);
  const [standingsCategory, setStandingsCategory] = useState(initialCategory);
  const overviewQuery = useSeasonOverview(season);
  const needsSeasonHistory = overviewQuery.data?.progress.roundsCount === 0;
  const seasonsQuery = useQuery({ ...seasonsQueryOptions(), enabled: needsSeasonHistory });
  const latestSeason = seasonsQuery.data?.items.filter((year) => year <= season).sort((a, b) => b - a)[0];
  const roundProfileQuery = useRoundProfile(season, lastResultsCategory);
  const predictionQuery = usePodiumPredictor(season, podiumCategory);
  const topRatedQuery = useHomeRanking(season, topRatedCategory, "rating");
  const standingsQuery = useHomeRanking(season, standingsCategory, "totalPoints");

  const createSummary = (
    category: string,
    options?: {
      topRated?: NonNullable<typeof topRatedQuery.data>["items"];
      standings?: NonNullable<typeof standingsQuery.data>["items"];
    },
  ): HomeSummary => ({
    season,
    category,
    nextRound: overviewQuery.data?.nextRound ?? null,
    lastCompletedRound:
      roundProfileQuery.data?.round ?? overviewQuery.data?.lastCompletedRound ?? null,
    lastRoundResults: (roundProfileQuery.data?.results ?? []).slice(0, 5).map((item) => ({
      ...item,
      time: item.raceTime,
    })),
    seasonTopRated: (options?.topRated ?? []).flatMap((item) =>
      item.rating == null ? [] : [{
        position: item.position,
        riderId: item.riderId,
        fullName: item.fullName,
        countryCode: item.countryCode,
        teamId: item.teamId,
        teamName: item.teamName,
        rating: item.rating,
        pace: item.pace,
        consistency: item.consistency,
        confidence: item.confidence,
      }],
    ),
    currentStandings: (options?.standings ?? []).map((item) => ({
      position: item.position,
      riderId: item.riderId,
      fullName: item.fullName,
      countryCode: item.countryCode,
      teamId: item.teamId,
      teamName: item.teamName,
      points: item.totalPoints,
    })),
  });

  const overviewSummary = createSummary(initialCategory);
  const lastRoundSummary = createSummary(lastResultsCategory);
  const topRatedSummary = createSummary(topRatedCategory, {
    topRated: topRatedQuery.data?.items ?? [],
  });
  const standingsSummary = createSummary(standingsCategory, {
    standings: standingsQuery.data?.items ?? [],
  });
  const speedResults = (roundProfileQuery.data?.results ?? []).map((item) => ({
    riderId: item.riderId,
    fullName: item.fullName,
    position: item.position,
    finalTime: item.raceTime,
    topSpeed: item.topSpeed,
    isPerfectRun: false,
  }));

  return (
    <PageContainer className={styles.homePage}>
      <header className={styles.hero}>
        <div className={styles.heroTitle}>
          <div className={styles.heroDots} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h1>Race Trace MTB</h1>
          <p className={styles.heroEyebrow}>Data &amp; Performance</p>
        </div>
        <p className={styles.heroDescription}>
          An independent analytics project built around the UCI Mountain Bike
          World Series Downhill. Explore every split from qualifying to finals,
          follow races live as the standings evolve, then return to the archive
          for detailed sector breakdowns, rider ratings, consistency trends and
          team comparisons — insights that go far beyond the official timing
          screen.
        </p>
      </header>
      <Section className={styles.homeSection}>
        <NextRoundSection
          summary={overviewSummary}
          loading={overviewQuery.isPending || (needsSeasonHistory && seasonsQuery.isPending)}
          error={overviewQuery.isError || (needsSeasonHistory && seasonsQuery.isError)}
          {...(needsSeasonHistory && latestSeason != null ? { nextSeason: latestSeason + 1 } : {})}
        />
      </Section>
      <Section className={styles.homeSection}>
        <PodiumPredictorSection
          {...(predictionQuery.data
            ? { prediction: predictionQuery.data }
            : {})}
          loading={predictionQuery.isFetching}
          error={predictionQuery.isError}
          category={podiumCategory}
          onCategoryChange={setPodiumCategory}
        />
      </Section>
      <Section className={styles.homeSection}>
        <LastRoundResultsSection
          summary={lastRoundSummary}
          loading={roundProfileQuery.isFetching}
          error={roundProfileQuery.isError}
          category={lastResultsCategory}
          onCategoryChange={setLastResultsCategory}
        />
      </Section>
      <Section className={styles.homeSection}>
        <TrackFingerprintSection
          {...(roundProfileQuery.data ? { profile: roundProfileQuery.data } : {})}
          loading={roundProfileQuery.isFetching}
          error={roundProfileQuery.isError}
          category={lastResultsCategory}
          onCategoryChange={setLastResultsCategory}
        />
      </Section>
      <Section className={styles.homeSection}>
        <FieldSpreadSection
          {...(roundProfileQuery.data ? { profile: roundProfileQuery.data } : {})}
          loading={roundProfileQuery.isFetching}
          error={roundProfileQuery.isError}
          category={lastResultsCategory}
          onCategoryChange={setLastResultsCategory}
        />
      </Section>
      <Section className={styles.homeSection}>
        <SpeedVsRunTimeSection
          summary={lastRoundSummary}
          results={speedResults}
          loading={roundProfileQuery.isPending}
          updating={roundProfileQuery.isFetching}
          category={lastResultsCategory}
          onCategoryChange={setLastResultsCategory}
        />
      </Section>
      <Section className={styles.homeSection}>
        <TopRatedSection
          summary={topRatedSummary}
          loading={topRatedQuery.isFetching}
          error={topRatedQuery.isError}
          category={topRatedCategory}
          onCategoryChange={setTopRatedCategory}
        />
      </Section>
      <Section className={styles.homeSection}>
        <CurrentStandingsSection
          summary={standingsSummary}
          loading={standingsQuery.isFetching}
          error={standingsQuery.isError}
          category={standingsCategory}
          onCategoryChange={setStandingsCategory}
        />
      </Section>
    </PageContainer>
  );
}
