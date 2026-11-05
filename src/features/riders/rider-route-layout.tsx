import { useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { UpdateProgress } from "../../components/feedback/update-progress";
import type { PressurePerformance } from "./api/pressure-performance-schema";
import { RouteLoadingPage } from "../../app/routes/route-states";
import { useRequiredRouteParam } from "../../app/routes/use-required-route-param";
import { useContextFilterOptions } from "../../components/filters/api/get-filter-options";
import { ContextFilters } from "../../components/filters/context-filters";
import { normalizeDisplayName } from "../../utils/display-name";
import { PageContainer } from "../../components/layout/page-container";
import { Tabs } from "../../components/navigation/tabs";
import { riderBasePath } from "../../components/navigation/rider-navigation-state";
import { BackButton } from "../../components/navigation/back-button";
import { routes } from "../../config/routes";
import { useMetricsFilters } from "../../hooks/use-metrics-filters";
import {
  categoryMatchesGender,
  formatCategoryLabel,
  getKnownCategories,
  juniorCategoryForAge,
} from "../../utils/categories";
import { riderImageFromId } from "../../utils/rider-image";
import { useRiderOverview, type RiderOverview } from "./api/get-rider-overview";
import {
  type RiderSessionResult,
} from "./api/rider-session-schema";
import {
  type RiderTeamHistoryItem,
} from "./api/team-history-schema";
import styles from "./rider-route-layout.module.css";
import { pageMeta } from "../../config/seo";
import { usePageMeta } from "../../hooks/use-page-meta";


const countries: Record<string, { name: string; flag: string }> = {
  AND: { name: "Andorra", flag: "🇦🇩" },
  AUS: { name: "Australia", flag: "🇦🇺" },
  AUT: { name: "Austria", flag: "🇦🇹" },
  BEL: { name: "Belgium", flag: "🇧🇪" },
  CAN: { name: "Canada", flag: "🇨🇦" },
  CZE: { name: "Czechia", flag: "🇨🇿" },
  ESP: { name: "Spain", flag: "🇪🇸" },
  FRA: { name: "France", flag: "🇫🇷" },
  GBR: { name: "United Kingdom", flag: "🇬🇧" },
  GER: { name: "Germany", flag: "🇩🇪" },
  IRL: { name: "Ireland", flag: "🇮🇪" },
  ITA: { name: "Italy", flag: "🇮🇹" },
  NED: { name: "Netherlands", flag: "🇳🇱" },
  NOR: { name: "Norway", flag: "🇳🇴" },
  NZL: { name: "New Zealand", flag: "🇳🇿" },
  POL: { name: "Poland", flag: "🇵🇱" },
  POR: { name: "Portugal", flag: "🇵🇹" },
  RSA: { name: "South Africa", flag: "🇿🇦" },
  SLO: { name: "Slovenia", flag: "🇸🇮" },
  SUI: { name: "Switzerland", flag: "🇨🇭" },
  SWE: { name: "Sweden", flag: "🇸🇪" },
  USA: { name: "United States", flag: "🇺🇸" },
};

const countryFlagCodes: Record<string, string> = {
  AND: "ad",
  AUS: "au",
  AUT: "at",
  BEL: "be",
  CAN: "ca",
  CZE: "cz",
  ESP: "es",
  FRA: "fr",
  GBR: "gb",
  GER: "de",
  IRL: "ie",
  ITA: "it",
  NED: "nl",
  NOR: "no",
  NZL: "nz",
  POL: "pl",
  POR: "pt",
  RSA: "za",
  SLO: "si",
  SUI: "ch",
  SWE: "se",
  USA: "us",
};

function countryDetails(code: string | null) {
  if (!code) return { name: "--", flag: "" };
  return countries[code.toUpperCase()] ?? { name: code, flag: "" };
}

export type RiderOutletContext = {
  riderId: string;
  overview: RiderOverview;
  sessionResults: RiderSessionResult[];
  teamHistory: RiderTeamHistoryItem[];
  pressurePerformance: PressurePerformance | null;
  pressurePerformanceLoading: boolean;
  isUpdating: boolean;
  hasDataError: boolean;
  retryData: () => void;
};

function emptyRiderOverview(riderId: string): RiderOverview {
  return {
    chartStatistics: { resultsAveragePosition: null, cumulativePointsByRound: {}, preFinalAverageByTrack: {}, cumulativeRatingByRound: {} },
    statistics: {
      riderId,
      uciId: null,
      firstName: null,
      lastName: null,
      fullName: "--",
      profileImageUrl: null,
      countryCode: null,
      teamId: null,
      teamName: null,
      teamCode: null,
      currentCategory: null,
      gender: null,
      sex: null,
      age: null,
      rating: null,
      pace: null,
      consistency: null,
      confidence: 0,
      averagePosition: null,
      totalPoints: 0,
      rankingPosition: null,
      qualifyingPositions: [],
      finalPositions: [],
      startsCount: 0,
      winsCount: 0,
      podiumsCount: 0,
      top5Count: 0,
      top10Count: 0,
      wonSplitsCount: 0,
      wonSectorsCount: 0,
      preFinalWonSplitsCount: 0,
      preFinalWonSectorsCount: 0,
      finalWonSplitsCount: 0,
      finalWonSectorsCount: 0,
      speed: null,
      averageQualifyingPosition: null,
      averageQualifying1Position: null,
      averageQualifying2Position: null,
      averageSemiFinalPosition: null,
      averageFinalPosition: null,
      averageSectorTimes: [],
      averageFinishTime: null,
    },
    roundResults: [],
    trackStatistics: [],
    sessionResults: [],
    pressurePerformance: {
      riderId,
      pressurePerformance: null,
      pressureTrend: "unavailable",
      sampleCount: 0,
      evidence: "unavailable",
      summary: {
        qualifyingPace: null,
        finalPace: null,
        delta: null,
        tendency: "unavailable",
        pairedRounds: 0,
      },
      points: [],
    },
    teamHistory: [],
  };
}

export default function RiderRouteLayout() {
  usePageMeta(pageMeta.rider);
  const riderId = useRequiredRouteParam("riderId");
  const location = useLocation();
  const riderBase = riderBasePath(location.pathname, riderId);
  const tabPaths = [
    riderBase,
    `${riderBase}/results`,
    `${riderBase}/tracks`,
  ];
  const activeTabIndex = Math.max(
    0,
    tabPaths.findIndex(
      (path) => path.replace(/\/$/, "") === location.pathname.replace(/\/$/, ""),
    ),
  );
  const previousTabIndex = useRef(activeTabIndex);
  const initializedCategoryRider = useRef<string | null>(null);
  const tabDirection =
    activeTabIndex >= previousTabIndex.current ? "forward" : "backward";
  const { filters, setFilters } = useMetricsFilters();
  const filterOptions = useContextFilterOptions();
  const allClassesSelected =
    filterOptions.options.classes.length > 0 &&
    filterOptions.options.classes.every((option) =>
      filters.classes.includes(option.value),
    );
  const appliedFilters = useMemo(
    () => (allClassesSelected ? { ...filters, classes: [] } : filters),
    [allClassesSelected, filters],
  );
  const overviewQuery = useRiderOverview(riderId, appliedFilters);
  const isInitialLoading = overviewQuery.isPending && !overviewQuery.data;
  const isUpdating =
    !isInitialLoading &&
    overviewQuery.isFetching;
  const hasDataError = overviewQuery.isError && !overviewQuery.data;
  const overview = overviewQuery.data ?? emptyRiderOverview(riderId);
  const sessionResults = overview.sessionResults;
  const statistics = overviewQuery.data?.statistics;
  const riderImage = riderImageFromId(
    statistics?.uciId ?? riderId,
    statistics?.fullName,
  );
  const country = countryDetails(statistics?.countryCode ?? null);
  const riderGender =
    statistics?.gender ??
    statistics?.sex;
  const riderFilterOptions = useMemo(
    () => ({
      ...filterOptions.options,
      categories: getKnownCategories()
        .filter((category) => categoryMatchesGender(category, riderGender))
        .map((category) => ({
          value: category.value,
          label: formatCategoryLabel(category.value),
        })),
    }),
    [filterOptions.options, riderGender],
  );
  useEffect(() => {
    if (!statistics || overviewQuery.isPlaceholderData) return;
    if (initializedCategoryRider.current !== riderId) {
      initializedCategoryRider.current = riderId;
      const juniorCategory = juniorCategoryForAge(statistics.age, riderGender);
      if (juniorCategory && (filters.categories.length !== 1 || filters.categories[0] !== juniorCategory)) {
        setFilters({ ...filters, categories: [juniorCategory] });
        return;
      }
    }
    if (!riderGender || filters.categories.length === 0) return;
    const available = new Set(
      riderFilterOptions.categories.map((category) => category.value),
    );
    if (filters.categories.some((category) => !available.has(category))) {
      setFilters({
        ...filters,
        categories: riderFilterOptions.categories[0]
          ? [riderFilterOptions.categories[0].value]
          : [],
      });
    }
  }, [filters, riderFilterOptions.categories, riderGender, setFilters, statistics, overviewQuery.isPlaceholderData, riderId]);

  useEffect(() => {
    previousTabIndex.current = activeTabIndex;
  }, [activeTabIndex]);

  if (isInitialLoading) {
    return <RouteLoadingPage />;
  }

  return (
    <PageContainer className={styles.riderPage}>
      <header className={styles.riderHeader}>
        <BackButton fallback={routes.ranking} useHistoryFallback={false} />
        <div className={styles.riderIdentity}>
          <div className={styles.profile}>
            <img src={riderImage} alt="" />
          </div>
          <div className={styles.riderCopy}>
            <div className={styles.nation}>
              {countryFlagCodes[
                statistics?.countryCode?.toUpperCase() ?? ""
              ] ? (
                <img
                  className={styles.flag}
                  src={`https://flagcdn.com/w40/${countryFlagCodes[statistics?.countryCode?.toUpperCase() ?? ""]}.png`}
                  srcSet={`https://flagcdn.com/w80/${countryFlagCodes[statistics?.countryCode?.toUpperCase() ?? ""]}.png 2x`}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              ) : null}
              <span>
                {country.name} ({statistics?.countryCode ?? "---"})
              </span>
            </div>
            <h1 className={styles.riderName}>
              {statistics?.fullName ?? "--"}
            </h1>
            <div className={styles.team}>
              <span className={styles.teamName}>
                {statistics?.teamName
                  ? normalizeDisplayName(statistics.teamName)
                  : "--"}
              </span>
              {statistics?.teamCode ? (
                <span className={styles.teamCode}>{statistics.teamCode}</span>
              ) : null}
            </div>
            <div className={styles.riderMeta}>
              <span>
                {formatCategoryLabel(statistics?.currentCategory ?? "") || "--"}
              </span>
              <span className={styles.metaSeparator}>//</span>
              <span>
                {statistics?.age ? `${statistics.age} y.o` : "-- y.o"}
              </span>
              <span className={styles.metaSeparator}>//</span>
              <span>DHI</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.tabsRow}>
        <Tabs
          label="Rider views"
          preserveSearch
          items={[
            { label: "Statistics", to: riderBase },
            { label: "Results", to: `${riderBase}/results` },
            { label: "Tracks", to: `${riderBase}/tracks` },
          ]}
        />
      </div>

      <div className={styles.filtersRow}>
        <ContextFilters
          options={riderFilterOptions}
          value={filters}
          onChange={setFilters}
          disabled={filterOptions.isPending}
        />
      </div>

      <div
        className={`${styles.contentArea} ${isUpdating ? styles.contentAreaUpdating : ""}`}
      >
        {isUpdating ? (
          <UpdateProgress
            className={styles.updateProgress}
            label="Loading rider data"
          />
        ) : null}
        <div
          className={`${styles.tabContent} ${tabDirection === "forward" ? styles.tabContentForward : styles.tabContentBackward}`}
          key={location.pathname}
        >
          <Outlet
            context={
              {
                riderId,
                overview,
                sessionResults,
                teamHistory: overview.teamHistory,
                pressurePerformance: overview.pressurePerformance,
                pressurePerformanceLoading: overviewQuery.isPending,
                isUpdating,
                hasDataError,
                retryData: () => {
                  void overviewQuery.refetch();
                },
              } satisfies RiderOutletContext
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}
