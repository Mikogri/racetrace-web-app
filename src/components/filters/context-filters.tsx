import type { FilterOption, MetricsFilters } from "../../types/domain";
import { MultiSelect } from "./multi-select";
import styles from "./context-filters.module.css";

export type ContextFilterOptions = {
  seasons: FilterOption[];
  tracks: FilterOption[];
  conditions: FilterOption[];
  classes: FilterOption[];
  categories: FilterOption[];
};

export function ContextFilters({
  options,
  value,
  onChange,
  disabled = false,
  showCategories = true,
}: {
  options: ContextFilterOptions;
  value: MetricsFilters;
  onChange: (filters: MetricsFilters) => void;
  disabled?: boolean;
  showCategories?: boolean;
}) {
  const update = (key: keyof MetricsFilters, selectedValues: string[]) => {
    onChange({ ...value, [key]: selectedValues });
  };

  return (
    <div className={styles.filters} aria-label="Data filters">
      <MultiSelect
        label="Seasons"
        options={options.seasons}
        selectedValues={value.seasons}
        onSelectionChange={(selected) => update("seasons", selected)}
        disabled={disabled}
      />
      <MultiSelect
        label="Tracks"
        options={options.tracks}
        selectedValues={value.tracks}
        onSelectionChange={(selected) => update("tracks", selected)}
        disabled={disabled}
        wideMenu
      />
      <MultiSelect
        label="Conditions"
        options={options.conditions}
        selectedValues={value.conditions}
        onSelectionChange={(selected) => update("conditions", selected)}
        disabled={disabled}
      />
      <MultiSelect
        label="Class"
        options={options.classes}
        selectedValues={value.classes}
        onSelectionChange={(selected) => update("classes", selected)}
        disabled={disabled}
      />
      {showCategories ? (
        <MultiSelect
          label="Categories"
          options={options.categories}
          selectedValues={value.categories}
          onSelectionChange={(selected) => update("categories", selected)}
          mode="single"
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}
