import { z } from "zod";

export const entityIdSchema = z
  .union([z.string(), z.number()])
  .transform(String);

export const paginationSchema = z
  .object({
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().nonnegative().optional(),
    limit: z.number().int().nonnegative().optional(),
    totalItems: z.number().int().nonnegative().optional(),
    total: z.number().int().nonnegative().optional(),
    totalPages: z.number().int().nonnegative().default(0),
  })
  .transform((value) => ({
    page: value.page,
    pageSize: value.pageSize ?? value.limit ?? 30,
    totalItems: value.totalItems ?? value.total ?? 0,
    totalPages: value.totalPages,
  }));

export const nullableStringSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? null);
export const nullableNumberSchema = z
  .number()
  .nullish()
  .transform((value) => value ?? null);
