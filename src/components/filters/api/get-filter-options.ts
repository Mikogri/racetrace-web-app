import { useQueries } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { entityIdSchema } from "../../../lib/validation";
import type { FilterOption } from "../../../types/domain";
import type { ContextFilterOptions } from "../context-filters";
import { filterOptionQueryKeys } from "./filter-option-query-keys";
import { useKnownCategories } from "../../../utils/categories";
import { filterQueryPolicy, seasonsQueryOptions } from "./get-seasons";

const listEnvelope = <T extends z.ZodType>(itemSchema: T) =>
  z
    .object({
      items: z.array(itemSchema).optional(),
      data: z.array(itemSchema).optional(),
    })
    .passthrough()
    .transform((value) => value.items ?? value.data ?? []);

const trackSchema = z
  .object({
    id: entityIdSchema.optional(),
    trackId: entityIdSchema.optional(),
    name: z.string().nullish(),
    trackName: z.string().nullish(),
    venue: z.string().nullish(),
    venueName: z.string().nullish(),
    countryCode: z.string().nullish(),
  })
  .passthrough()
  .transform((item): FilterOption | null => {
    const value = item.id ?? item.trackId;
    const label = item.name ?? item.trackName;
    if (!value || !label) return null;
    const subtitle = [item.venue ?? item.venueName, item.countryCode]
      .filter(Boolean)
      .join(", ");
    return { value, label, ...(subtitle ? { subtitle } : {}) };
  });

const simpleOptionSchema = z
  .object({
    id: entityIdSchema,
    name: z.string(),
  })
  .passthrough()
  .transform((item): FilterOption => ({ value: item.id, label: item.name }));

const classOptionSchema = z
  .object({
    id: entityIdSchema,
    code: z.string().nullish(),
    name: z.string(),
    abbreviation: z.string().nullish(),
  })
  .passthrough()
  .transform((item): FilterOption => ({
    value: item.id,
    label: item.name,
  }));

export function useContextFilterOptions() {
  const knownCategories = useKnownCategories();
  const [seasons, tracks, conditions, classes] = useQueries({
    queries: [
      seasonsQueryOptions(),
      {
        queryKey: filterOptionQueryKeys.tracks(),
        queryFn: ({ signal }) =>
          apiClient.get("/api/v1/tracks", listEnvelope(trackSchema), {
            signal,
            query: { pageSize: 150, sortBy: "name", sortDirection: "asc" },
          }),
        ...filterQueryPolicy,
      },
      {
        queryKey: filterOptionQueryKeys.conditions(),
        queryFn: ({ signal }) =>
          apiClient.get(
            "/api/v1/conditions",
            listEnvelope(simpleOptionSchema),
            {
              signal,
              query: { pageSize: 100, sortBy: "name", sortDirection: "asc" },
            },
          ),
        ...filterQueryPolicy,
      },
      {
        queryKey: filterOptionQueryKeys.competitionClasses(),
        queryFn: ({ signal }) =>
          apiClient.get(
            "/api/v1/competition-classes",
            listEnvelope(classOptionSchema),
            { signal },
          ),
        ...filterQueryPolicy,
      },
    ],
  });

  const options: ContextFilterOptions = {
    seasons: (seasons.data?.items ?? []).map((season) => ({
      value: String(season),
      label: String(season),
    })),
    tracks: (tracks.data ?? []).filter(
      (option): option is FilterOption => option !== null,
    ),
    conditions: conditions.data ?? [],
    classes: classes.data ?? [],
    categories: knownCategories.map(({ value, abbreviation, label }) => ({
      value,
      label: abbreviation,
      tooltip: label,
    })),
  };

  return {
    options,
    isPending:
      seasons.isPending ||
      tracks.isPending ||
      conditions.isPending ||
      classes.isPending,
    isError:
      seasons.isError || tracks.isError || conditions.isError || classes.isError,
  };
}
