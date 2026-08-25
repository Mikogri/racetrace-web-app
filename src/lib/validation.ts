import { z } from 'zod'

export const entityIdSchema = z.union([z.string(), z.number()]).transform(String)

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
  }))

export const nullableStringSchema = z.string().nullish().transform((value) => value ?? null)
export const nullableNumberSchema = z.number().nullish().transform((value) => value ?? null)

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z
    .object({
      items: z.array(itemSchema).optional(),
      data: z.array(itemSchema).optional(),
      pagination: paginationSchema.optional(),
      page: z.number().int().positive().optional(),
      pageSize: z.number().int().nonnegative().optional(),
      limit: z.number().int().nonnegative().optional(),
      totalItems: z.number().int().nonnegative().optional(),
      total: z.number().int().nonnegative().optional(),
      totalPages: z.number().int().nonnegative().optional(),
    })
    .passthrough()
    .transform((value) => {
      const items = value.items ?? value.data ?? []
      const page = value.pagination?.page ?? value.page ?? 1
      const pageSize = value.pagination?.pageSize ?? value.pageSize ?? value.limit ?? 30
      const totalItems = value.pagination?.totalItems ?? value.totalItems ?? value.total ?? items.length
      const totalPages =
        value.pagination?.totalPages ??
        value.totalPages ??
        (totalItems === 0 || pageSize === 0 ? 0 : Math.ceil(totalItems / pageSize))
      return { items, pagination: { page, pageSize, totalItems, totalPages } }
    })
