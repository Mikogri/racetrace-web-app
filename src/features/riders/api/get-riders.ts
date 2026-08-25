import { queryOptions, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '../../../lib/api-client'
import { GLOBAL_PAGE_SIZE } from '../../../config/pagination'
import { entityIdSchema, paginationSchema } from '../../../lib/validation'
import type { MetricsFilters, RiderSummary } from '../../../types/domain'
import type { PaginatedResult } from '../../../types/api'
import { riderQueryKeys } from './rider-query-keys'

const nullableString = z.string().nullish()

const riderItemSchema = z
  .object({
    riderId: entityIdSchema.optional(),
    id: entityIdSchema.optional(),
    fullName: nullableString,
    firstName: nullableString,
    lastName: nullableString,
    first_name: nullableString,
    last_name: nullableString,
    teamName: nullableString,
    team_name: nullableString,
    countryCode: nullableString,
    nation: nullableString,
    category: nullableString,
    categoryCode: nullableString,
    profileImageUrl: nullableString,
    profile_image_url: nullableString,
  })
  .passthrough()
  .transform((value): RiderSummary | null => {
    const id = value.riderId ?? value.id
    const name =
      value.fullName ??
      [value.firstName ?? value.first_name, value.lastName ?? value.last_name]
        .filter(Boolean)
        .join(' ')
    if (!id || !name.trim()) return null
    return {
      id,
      name: name.trim(),
      team: value.teamName ?? value.team_name ?? null,
      country: value.countryCode ?? value.nation ?? null,
      category: value.category ?? value.categoryCode ?? null,
      profileImageUrl: value.profileImageUrl ?? value.profile_image_url ?? null,
    }
  })

const ridersResponseSchema = z
  .object({
    items: z.array(riderItemSchema).optional(),
    data: z.array(riderItemSchema).optional(),
    pagination: paginationSchema.optional(),
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().nonnegative().optional(),
    totalItems: z.number().int().nonnegative().optional(),
    totalPages: z.number().int().nonnegative().optional(),
  })
  .passthrough()
  .transform((value): PaginatedResult<RiderSummary> => {
    const items = (value.items ?? value.data ?? []).filter(
      (item): item is RiderSummary => item !== null,
    )
    const fallback = {
      page: value.page ?? 1,
      pageSize: value.pageSize ?? GLOBAL_PAGE_SIZE,
      totalItems: value.totalItems ?? items.length,
      totalPages: value.totalPages ?? (items.length > 0 ? 1 : 0),
    }
    return { items, pagination: value.pagination ?? fallback }
  })

export type GetRidersParams = {
  search: string
  filters: MetricsFilters
  pageSize?: number
  sortBy?: 'fullName' | 'points'
  sortDirection?: 'asc' | 'desc'
}

function csv(values: string[]) {
  return values.length > 0 ? values.join(',') : undefined
}

export function getRiders(params: GetRidersParams, signal?: AbortSignal) {
  return apiClient.get('/api/v1/riders', ridersResponseSchema, {
    ...(signal ? { signal } : {}),
    query: {
      search: params.search,
      sortBy: params.sortBy ?? 'fullName',
      sortDirection: params.sortDirection ?? 'asc',
      pageSize: params.pageSize ?? GLOBAL_PAGE_SIZE,
      season: csv(params.filters.seasons),
      trackId: csv(params.filters.tracks),
      conditionId: csv(params.filters.conditions),
      competitionClassId: csv(params.filters.classes),
      category: params.filters.categories[0],
    },
  })
}

export function getRidersQueryOptions(params: GetRidersParams) {
  return queryOptions({
    queryKey: riderQueryKeys.list(params),
    queryFn: ({ signal }) => getRiders(params, signal),
  })
}

export function useRiders(
  params: GetRidersParams,
  queryConfig?: { enabled?: boolean },
) {
  return useQuery({ ...getRidersQueryOptions(params), ...queryConfig })
}
