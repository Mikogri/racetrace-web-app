import type { MetricsFilters } from "../types/domain";

// Preserve order, duplicates and omitted empty selections: they are part of the current request contract.
export function serializeFilterValues(
  values: readonly string[],
): string | undefined {
  return values.length > 0 ? values.join(",") : undefined;
}

export function metricsApiQuery(filters: MetricsFilters) {
  return {
    season: serializeFilterValues(filters.seasons),
    trackId: serializeFilterValues(filters.tracks),
    conditionId: serializeFilterValues(filters.conditions),
    competitionClassId: serializeFilterValues(filters.classes),
    category: filters.categories[0],
  };
}
