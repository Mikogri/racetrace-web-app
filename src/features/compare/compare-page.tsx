import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContextFilterOptions } from "../../components/filters/api/get-filter-options";
import { ContextFilters } from "../../components/filters/context-filters";
import { ErrorState } from "../../components/feedback/states";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { SelectRiderModal } from "../../components/overlays/select-rider-modal";
import { useMetricsFilters } from "../../hooks/use-metrics-filters";
import type { RiderSummary } from "../../types/domain";
import { useCompare } from "./api/get-compare";
import { CompareRiderHero } from "./components/compare-rider-hero";
import {
  CompareConsistencyChart,
  CompareHistoryCharts,
  CompareMetricChart,
  ComparePositionChart,
  CompareResultsChart,
  CompareSectorTable,
  CompareStatisticsTable,
} from "./components/compare-panels";
import styles from "./compare-page.module.css";
import { formatCategoryLabel } from "../../utils/categories";
import { pageMeta } from "../../config/seo";
import { usePageMeta } from "../../hooks/use-page-meta";

type ActiveSlot = "a" | "b" | null;

function CompareDataSkeleton() {
  return (
    <div
      className={`${styles.data} ${styles.skeleton}`}
      role="status"
      aria-label="Loading comparison data"
    >
      <section className={`${styles.dataRow} ${styles.twoColumns}`}>
        <div className={styles.skeletonChart}>
          <i />
          <span />
        </div>
        <div className={styles.skeletonChart}>
          <i />
          <span />
        </div>
      </section>
      <section className={`${styles.dataRow} ${styles.twoColumns}`}>
        <div className={styles.skeletonTable}>
          <i />
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className={styles.skeletonTable}>
          <i />
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </section>
      <section className={styles.dataRow}>
        <div className={styles.skeletonWide}>
          <i />
          <span />
        </div>
      </section>
      <section className={styles.dataRow}>
        <div className={styles.skeletonWide}>
          <i />
          <span />
        </div>
      </section>
    </div>
  );
}

export default function ComparePage() {
  usePageMeta(pageMeta.compare);
  const { filters, setFilters } = useMetricsFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterOptions = useContextFilterOptions();
  const compareFilterOptions = useMemo(
    () => ({
      ...filterOptions.options,
      categories: filterOptions.options.categories.map((option) => ({
        ...option,
        label: option.tooltip ?? formatCategoryLabel(option.value),
      })),
    }),
    [filterOptions.options],
  );
  const [selectedRiders, setSelectedRiders] = useState<
    Record<string, RiderSummary>
  >({});
  const [activeSlot, setActiveSlot] = useState<ActiveSlot>(null);
  const riderAId = searchParams.get("riderA");
  const riderBId = searchParams.get("riderB");
  const comparisonFilters = useMemo(
    () => ({
      ...filters,
      categories: [filters.categories[0] ?? "elite_men"],
    }),
    [filters],
  );
  const selectedIds = [riderAId, riderBId].filter((item): item is string =>
    Boolean(item),
  );
  const bothSelected =
    riderAId !== null && riderBId !== null && new Set(selectedIds).size === 2;
  const compareQuery = useCompare(selectedIds, comparisonFilters);
  const isUpdating = compareQuery.isFetching && !compareQuery.isPending;
  const riderADetails = compareQuery.data?.riders.find(
    (rider) => rider.riderId === riderAId,
  );
  const riderBDetails = compareQuery.data?.riders.find(
    (rider) => rider.riderId === riderBId,
  );
  const riderSummary = (id: string | null, details: typeof riderADetails) => {
    if (id === null) return null;
    return (
      selectedRiders[id] ?? {
        id,
        name: details?.fullName ?? "--",
        team: details?.teamName ?? null,
        country: details?.countryCode ?? null,
        category: details?.currentCategory ?? null,
        profileImageUrl: null,
      }
    );
  };
  const riderA = riderSummary(riderAId, riderADetails);
  const riderB = riderSummary(riderBId, riderBDetails);

  const selectRider = (
    slot: Exclude<ActiveSlot, null>,
    rider: RiderSummary,
  ) => {
    const next = new URLSearchParams(searchParams);
    next.set(slot === "a" ? "riderA" : "riderB", rider.id);
    setSelectedRiders((current) => ({ ...current, [rider.id]: rider }));
    setSearchParams(next, { replace: true });
  };

  return (
    <PageContainer
      className={`${styles.page} ${isUpdating ? styles.pageUpdating : ""}`}
    >
      <PageHeader
        title="Compare"
        eyebrow="Statistics / Comparison / Versus"
        description="Compare riders across seasons or date ranges using key performance metrics and results."
      />

      <Section className={styles.filtersSection}>
        <ContextFilters
          options={compareFilterOptions}
          value={comparisonFilters}
          onChange={setFilters}
          disabled={filterOptions.isPending}
        />
        {isUpdating ? (
          <span
            className={styles.updateProgress}
            aria-label="Updating comparison data"
            role="progressbar"
          >
            <i />
          </span>
        ) : null}
      </Section>

      <Section className={styles.ridersSection}>
        <div className={styles.riders}>
          <CompareRiderHero
            key={`a-${riderAId ?? "empty"}`}
            slot="a"
            rider={riderA}
            details={riderADetails}
            selectedCategory={comparisonFilters.categories[0] ?? "elite_men"}
            onSelect={() => setActiveSlot("a")}
          />
          <span className={styles.versus}>VS</span>
          <CompareRiderHero
            key={`b-${riderBId ?? "empty"}`}
            slot="b"
            rider={riderB}
            details={riderBDetails}
            selectedCategory={comparisonFilters.categories[0] ?? "elite_men"}
            onSelect={() => setActiveSlot("b")}
          />
        </div>
      </Section>

      {bothSelected && compareQuery.isPending ? <CompareDataSkeleton /> : null}
      {bothSelected && compareQuery.isError ? (
        <Section>
          <ErrorState
            message={compareQuery.error.message}
            onRetry={() => void compareQuery.refetch()}
          />
        </Section>
      ) : null}
      {compareQuery.data ? (
        <div className={styles.data}>
          <section className={`${styles.dataRow} ${styles.twoColumns}`}>
            <CompareResultsChart data={compareQuery.data} />
            <CompareMetricChart data={compareQuery.data} />
          </section>
          <section className={`${styles.dataRow} ${styles.twoColumns}`}>
            <CompareSectorTable data={compareQuery.data} />
            <CompareStatisticsTable data={compareQuery.data} />
          </section>
          <section className={`${styles.dataRow} ${styles.twoColumns}`}>
            <ComparePositionChart data={compareQuery.data} />
            <CompareConsistencyChart data={compareQuery.data} />
          </section>
          <section className={`${styles.dataRow} ${styles.historyRow}`}>
            <CompareHistoryCharts data={compareQuery.data} />
          </section>
        </div>
      ) : null}

      <SelectRiderModal
        open={activeSlot !== null}
        onClose={() => setActiveSlot(null)}
        filters={comparisonFilters}
        excludedRiderIds={selectedIds}
        onConfirm={(rider) => {
          const otherRiderId = activeSlot === "a" ? riderBId : riderAId;
          if (rider.id === otherRiderId) return;
          if (activeSlot) selectRider(activeSlot, rider);
          setActiveSlot(null);
        }}
      />
    </PageContainer>
  );
}
