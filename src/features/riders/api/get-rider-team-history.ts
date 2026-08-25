import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "../../../lib/api-client";
import { entityIdSchema, nullableStringSchema } from "../../../lib/validation";
import { riderQueryKeys } from "./rider-query-keys";

const riderTeamHistoryItemSchema = z.object({
  id: entityIdSchema,
  riderId: entityIdSchema,
  teamId: entityIdSchema,
  teamName: z.string(),
  teamCode: nullableStringSchema,
  validFrom: z.string(),
  validTo: nullableStringSchema,
  isCurrent: z.boolean(),
  sourceRoundId: entityIdSchema.nullish().transform((value) => value ?? null),
});

export const riderTeamHistorySchema = z.array(riderTeamHistoryItemSchema);

export type RiderTeamHistoryItem = z.infer<typeof riderTeamHistoryItemSchema>;

export function useRiderTeamHistory(
  riderId: string,
  range: { dateFrom?: string; dateTo?: string },
) {
  return useQuery({
    queryKey: riderQueryKeys.teamHistory(riderId, range.dateFrom, range.dateTo),
    queryFn: ({ signal }) =>
      apiClient.get(
        `/api/v1/riders/${encodeURIComponent(riderId)}/team-history`,
        riderTeamHistorySchema,
        { signal, query: range },
      ),
    placeholderData: keepPreviousData,
  });
}
