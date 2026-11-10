export type EntityId = string;
export type RatingTone = "low" | "medium" | "high" | "veryHigh" | "top";

export type FilterOption = {
  value: string;
  label: string;
  subtitle?: string;
  tooltip?: string;
};

export type RiderSummary = {
  id: EntityId;
  name: string;
  team: string | null;
  country: string | null;
  category: string | null;
  profileImageUrl: string | null;
};

export type MetricsFilters = {
  seasons: string[];
  tracks: string[];
  conditions: string[];
  classes: string[];
  categories: string[];
};

export const emptyMetricsFilters: MetricsFilters = {
  seasons: [],
  tracks: [],
  conditions: [],
  classes: [],
  categories: [],
};
