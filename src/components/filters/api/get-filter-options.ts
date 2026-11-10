import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { entityIdSchema } from "../../../lib/validation";
import type { FilterOption } from "../../../types/domain";
import type { ContextFilterOptions } from "../context-filters";
import { filterOptionQueryKeys } from "./filter-option-query-keys";
import { useKnownCategories } from "../../../utils/categories";
import { filterQueryPolicy } from "./get-seasons";

const namedOptionSchema = z
  .object({ id: entityIdSchema, name: z.string() })
  .transform((item): FilterOption => ({ value: item.id, label: item.name }));

const filterOptionsSchema = z.object({
  seasons: z.array(z.number().int().min(1990).max(2100)),
  tracks: z.array(
    z
      .object({
        id: entityIdSchema,
        name: z.string().nullish(),
        venue: z.string().nullish(),
        countryCode: z.string().nullish(),
      })
      .transform((item): FilterOption | null => {
        if (!item.name) return null;
        const subtitle = [item.venue, item.countryCode]
          .filter(Boolean)
          .join(", ");
        return {
          value: item.id,
          label: item.name,
          ...(subtitle ? { subtitle } : {}),
        };
      }),
  ),
  conditions: z.array(namedOptionSchema),
  competitionClasses: z.array(namedOptionSchema),
});

export function useContextFilterOptions() {
  const knownCategories = useKnownCategories();
  const filters = useQuery({
    queryKey: filterOptionQueryKeys.context(),
    queryFn: ({ signal }) =>
      apiClient.get("/api/v1/filter-options", filterOptionsSchema, { signal }),
    ...filterQueryPolicy,
  });

  const options: ContextFilterOptions = {
    seasons: (filters.data?.seasons ?? []).map((season) => ({
      value: String(season),
      label: String(season),
    })),
    tracks: (filters.data?.tracks ?? []).filter(
      (option): option is FilterOption => option !== null,
    ),
    conditions: filters.data?.conditions ?? [],
    classes: filters.data?.competitionClasses ?? [],
    categories: knownCategories.map(({ value, abbreviation, label }) => ({
      value,
      label: abbreviation,
      tooltip: label,
    })),
  };
  return { options, isPending: filters.isPending, isError: filters.isError };
}
