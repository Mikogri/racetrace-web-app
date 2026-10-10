import type { ApiSchema, AssertApiContract } from '../../../types/api-contract'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '../../../lib/api-client'
import { USE_SIMULATED_API_DATA, waitForSimulatedApi } from '../../../config/demo-data'
import { entityIdSchema, nullableStringSchema } from '../../../lib/validation'
import { resultsQueryKeys } from './results-query-keys'

const RESULTS_PAGE_SIZE = 100

export const roundListItemSchema = z.object({
  roundId: entityIdSchema,
  roundNumber: z.number().int().nullish().transform((value) => value ?? null),
  season: z.number().int(),
  contextName: nullableStringSchema,
  imageUrl: nullableStringSchema,
  trackId: entityIdSchema,
  trackName: nullableStringSchema,
  venueId: entityIdSchema.nullish().transform((value) => value ?? null),
  venueName: nullableStringSchema,
  countryCode: nullableStringSchema,
  startDate: nullableStringSchema,
  endDate: nullableStringSchema,
  status: z.string(),
  competitionClassId: entityIdSchema.nullish().transform((value) => value ?? null),
  competitionClassCode: nullableStringSchema,
  competitionClassName: nullableStringSchema,
  competitionClassAbbreviation: nullableStringSchema,
  competitionClassPriority: z.number().int().nullish().transform((value) => value ?? null),
})

const roundsResponseSchema = z.object({
  items: z.array(roundListItemSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type RoundListItem = z.infer<typeof roundListItemSchema>

const venues = [
  ['Fort William', 'Fort William', 'GBR'],
  ['Bielsko-Biala', 'Bielsko-Biala', 'POL'],
  ['Leogang', 'Leogang', 'AUT'],
  ['Val di Sole', 'Daolasa', 'ITA'],
  ['La Thuile', 'La Thuile', 'ITA'],
  ['Pal Arinsal', 'Andorra', 'AND'],
  ['Les Gets', 'Les Gets', 'FRA'],
  ['Mont-Sainte-Anne', 'Mont-Sainte-Anne', 'CAN'],
  ['Champéry', 'Champéry', 'SUI'],
] as const

async function getSimulatedRounds(params: { season: number; page: number }, signal: AbortSignal) {
  await waitForSimulatedApi(signal, 1200)
  const items = venues.map(([trackName, venueName, countryCode], index): RoundListItem => {
    const month = String(Math.min(10, 5 + index)).padStart(2, '0')
    const startDay = String(3 + index).padStart(2, '0')
    const endDay = String(4 + index).padStart(2, '0')
    const championship = index === 6
    const upcoming = index >= 7
    return {
      roundId: `demo-round-${params.season}-${index + 1}`,
      roundNumber: index + 1,
      season: params.season,
      contextName: `demo-${params.season}-mtb`,
      imageUrl: upcoming ? null : 'demo',
      trackId: `demo-track-${index + 1}`,
      trackName,
      venueId: `demo-venue-${index + 1}`,
      venueName,
      countryCode,
      startDate: `${params.season}-${month}-${startDay}`,
      endDate: `${params.season}-${month}-${endDay}`,
      status: upcoming ? 'upcoming' : 'completed',
      competitionClassId: championship ? 'demo-wch' : 'demo-wc',
      competitionClassCode: championship ? 'world_championship' : 'world_cup',
      competitionClassName: championship ? 'World Championships' : 'World Cup',
      competitionClassAbbreviation: championship ? 'WCH' : 'WC',
      competitionClassPriority: championship ? 1 : 2,
    }
  })
  return roundsResponseSchema.parse({ items, page: 1, pageSize: RESULTS_PAGE_SIZE, totalItems: items.length, totalPages: 1 })
}

export function useRounds(params: { season: number; page: number }) {
  return useQuery({
    queryKey: resultsQueryKeys.list(params),
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => USE_SIMULATED_API_DATA ? getSimulatedRounds(params, signal) : apiClient.get('/api/v1/rounds', roundsResponseSchema, {
      signal,
      query: {
        season: params.season,
        sortBy: 'roundNumber',
        sortDirection: 'asc',
        page: 1,
        pageSize: RESULTS_PAGE_SIZE,
      },
    }),
  })
}
export type RoundsWireContract = AssertApiContract<ApiSchema<'PublicPagedResponseOfRoundListItemDto'> extends z.input<typeof roundsResponseSchema> ? true : false>
