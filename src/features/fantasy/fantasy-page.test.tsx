import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fantasyCurrentSchema, fantasyRulesSchema, type FantasyCurrent, type FantasyRider } from './api/get-fantasy'
import FantasyPage from './fantasy-page'
import { fantasyDate, fantasyNumber, fantasyValue, sortFantasyRiders } from './fantasy-format'
import { navigationItems } from '../../config/routes'
import { isNavigationSectionActive, riderPathForLocation } from '../../components/navigation/rider-navigation-state'

const state = vi.hoisted(() => ({ data: undefined as FantasyCurrent | undefined, fetching: false, error: false, refetch: vi.fn() }))
vi.mock('./api/get-fantasy', async importOriginal => ({
  ...await importOriginal<typeof import('./api/get-fantasy')>(),
  useFantasyCurrent: () => ({ data: state.data, isFetching: state.fetching, isError: state.error, refetch: state.refetch }),
  useFantasyRules: () => ({ data: undefined, isFetching: false, refetch: vi.fn() }),
}))

function rider(overrides: Partial<FantasyRider> = {}): FantasyRider {
  return { pinkbikeExternalId: '1', riderId: '101', name: 'Sample Rider', countryCode: 'FRA', gender: 'male',
    price: 200000, pinkbikeSeasonPoints: 500, injuryFlag: false, expectedFinalPoints: 220, expectedQ1Bonus: 30,
    expectedFantasyPoints: 250, predictedPosition: 4.2, confidence: 80, isRecommended: false, warnings: [], ...overrides }
}
function overview(riders: FantasyRider[] = []): FantasyCurrent {
  return { season: 2026, status: 'ready', predictionEngineVersion: 'v1', fantasyProjectionVersion: 'v1', priceSnapshotId: 'snapshot', sourceUrl: 'https://www.pinkbike.com/contest/fantasy/',
    round: { roundId: '23', roundNumber: 4, venue: 'Val di Sole', trackName: 'Black Snake', startDate: '2026-06-14' },
    riders, recommendation: null, warnings: [], fetchedAtUtc: '2026-06-12T12:00:00Z' }
}
const view = () => <MemoryRouter initialEntries={['/fantasy']}><FantasyPage /></MemoryRouter>

describe('Fantasy page', () => {
  beforeEach(() => { state.data = undefined; state.fetching = false; state.error = false; state.refetch.mockClear() })

  it('uses the standard loading and retry states without inventing a team', async () => {
    state.fetching = true
    const { rerender } = render(view())
    expect(screen.getByText('Loading')).toBeInTheDocument()
    state.fetching = false; state.error = true
    rerender(view())
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(state.refetch).toHaveBeenCalledOnce()
  })

  it('defaults to men and projected points, sorts by price and changes category independently', async () => {
    state.data = overview([rider({ name: 'Fast Rider', price: 100000 }), rider({ name: 'Expensive Rider', pinkbikeExternalId: '2', expectedFantasyPoints: 100, price: 350000 }), rider({ name: 'Woman Rider', pinkbikeExternalId: '3', gender: 'female' })])
    render(view())
    const table = screen.getByRole('table', { name: 'Fantasy rider projections' })
    expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Fast Rider')
    expect(screen.queryByText('Woman Rider')).not.toBeInTheDocument()
    await userEvent.click(within(table).getByRole('button', { name: 'Price' }))
    expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Expensive Rider')
    await userEvent.click(screen.getByRole('button', { name: 'Women Elite' }))
    expect(screen.getByText('Woman Rider')).toBeInTheDocument()
    expect(screen.queryByText('Fast Rider')).not.toBeInTheDocument()
  })

  it('keeps loaded content during refresh and displays a progress bar', () => {
    state.data = overview([rider()]); state.fetching = true
    render(view())
    expect(screen.getByText('Sample Rider')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Updating fantasy data' })).toBeInTheDocument()
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })

  it('keeps the recommended team first and collapses API data notices without discarding them', async () => {
    state.data = { ...overview(), warnings: ['Start list not confirmed.', 'Historical prices unavailable.'] }
    render(view())
    const summary = screen.getByRole('button', { name: 'Data Notices (2)' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Best team for next round' }).compareDocumentPosition(summary)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    await userEvent.click(summary)
    expect(screen.getByRole('dialog', { name: 'Data Notices' })).toBeVisible()
    expect(screen.getByText('Historical prices unavailable.')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await userEvent.click(screen.getByRole('button', { name: 'How It Works' }))
    expect(screen.getByRole('dialog', { name: 'How It Works' })).toHaveTextContent('200 points at $250,000')
  })

  it('shows total projected points in the team header without a bottom summary', () => {
    state.data = { ...overview(), recommendation: { riders: [], totalPrice: 1500000, remainingBudget: 0, expectedFantasyPoints: 379 } }
    render(view())
    const region = screen.getByRole('region', { name: 'Best team for next round' })
    expect(within(region).getByText('379').closest('header')).not.toBeNull()
    expect(within(region).queryByText('Remaining Budget')).not.toBeInTheDocument()
    expect(within(region).queryByText('Team Price')).not.toBeInTheDocument()
  })

  it('uses compact headers, category totals, no gender subtitle and no refresh action', () => {
    state.data = overview([rider()])
    render(view())
    expect(screen.getByRole('heading', { name: 'Best Team' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Rider Projections' })).toBeInTheDocument()
    expect(screen.getByText('1 Riders')).toBeInTheDocument()
    expect(screen.queryByText('Male')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rules' })).toBeInTheDocument()
    expect(screen.getByText('Waiting for verified team data.')).toBeInTheDocument()
  })

  it('shows no upcoming round and no data without fabricated placeholders', () => {
    state.data = { ...overview(), round: null }
    render(view())
    expect(screen.getByText('No upcoming round')).toBeInTheDocument()
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('displays missing projections as missing, and leaves unmapped riders unlinked', () => {
    state.data = overview([rider({ riderId: null, expectedFinalPoints: null, expectedQ1Bonus: null, expectedFantasyPoints: null, predictedPosition: null })])
    render(view())
    expect(screen.queryByRole('link', { name: 'Sample Rider' })).not.toBeInTheDocument()
    expect(screen.getByText('No eligible team available')).toBeInTheDocument()
  })
})

describe('Fantasy contracts and presentation', () => {
  it.each([[10.6, '10.6'], [10, '10.0'], [100, '100'], [1.2, '1.20'], [0, '0.00'], [99.99, '100'], [999.99, '1000'], [1234.567, '1234.57']])('formats %s compactly as %s', (value, expected) => {
    expect(fantasyNumber(value as number)).toBe(expected)
  })
  it('preserves the local calendar date of the upcoming round', () => {
    expect(fantasyDate('2026-09-26T00:00:00+02:00')).toBe('26 Sept 2026')
    expect(fantasyDate(null)).toBe('--')
  })
  it('validates the API contract and rejects malformed financial values', () => {
    expect(fantasyCurrentSchema.safeParse(overview([rider()])).success).toBe(true)
    expect(fantasyCurrentSchema.safeParse(overview([rider({ price: Number.NaN })])).success).toBe(false)
  })
  it('accepts different final scoring tables for men and women', () => {
    expect(fantasyRulesSchema.safeParse({ season: 2026, version: '2026-v1', budget: 1500000, teamSize: 6, men: 4, women: 2,
      finalPlacementPoints: [{ position: 30, menPoints: 10, womenPoints: null }], q1Bonus: [{ position: 1, points: 100 }], dynamicPricing: true, sourceUrl: 'https://www.pinkbike.com/' }).success).toBe(true)
  })
  it('keeps missing data last for both sort directions and never mutates source data', () => {
    const original = [rider({ name: 'Missing', expectedFantasyPoints: null }), rider({ name: 'Zero', expectedFantasyPoints: 0 }), rider()]
    for (const direction of ['asc', 'desc'] as const) expect(sortFantasyRiders(original, 'expectedFantasyPoints', direction).at(-1)?.name).toBe('Missing')
    expect(original[0].name).toBe('Missing')
    expect(fantasyValue(rider({ price: 0 }))).toBeNull()
    expect(fantasyValue(rider())).toBe(125)
  })
  it('places Fantasy before About and preserves the source menu through rider details', () => {
    const names = navigationItems.map(item => item.label)
    expect(names.indexOf('Fantasy')).toBe(names.indexOf('About') - 1)
    expect(riderPathForLocation('/fantasy', '101')).toBe('/fantasy/riders/101')
    expect(isNavigationSectionActive('/fantasy/riders/101/tracks', '/fantasy')).toBe(true)
  })
})
