import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { z } from "zod";
import { entityIdSchema, nullableStringSchema } from "../../../lib/validation";

const riderTeamHistoryItemSchema = z.object({
  id: entityIdSchema,
  riderId: entityIdSchema,
  teamId: entityIdSchema,
  teamName: z.string().nullable(),
  teamCode: nullableStringSchema,
  validFrom: z.string(),
  validTo: nullableStringSchema,
  isCurrent: z.boolean(),
  sourceRoundId: entityIdSchema.nullish().transform((value) => value ?? null),
});

export const riderTeamHistorySchema = z.array(riderTeamHistoryItemSchema);

export type RiderTeamHistoryItem = z.infer<typeof riderTeamHistoryItemSchema>;

export type RiderTeamHistoryWireContract = AssertApiContract<ApiSchema<'RiderTeamHistoryDto'> extends z.input<typeof riderTeamHistoryItemSchema> ? true : false>
