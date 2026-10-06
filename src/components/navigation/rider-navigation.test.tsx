import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RiderCell } from '../data-display/rider-cell'
import { BackButton } from './back-button'
import { Tabs } from './tabs'
import { TopNavigation } from './top-navigation'
import { RiderLink } from './rider-navigation'

function LocationState() {
  const location = useLocation()
  return <output>{JSON.stringify(location.state)}</output>
}

describe('rider navigation', () => {
  it('passes only metrics filters from ranking to rider details', () => {
    render(<MemoryRouter initialEntries={['/ranking?categories=junior_women&seasons=2025,2026&tracks=3,7&conditions=wet&classes=wc,wch&search=Anna&sort=points&page=3']}>
      <RiderLink riderId="7">Anna</RiderLink>
    </MemoryRouter>)
    const url = new URL(screen.getByRole('link').getAttribute('href')!, 'https://example.test')
    expect(url.pathname).toBe('/ranking/riders/7')
    expect(Object.fromEntries(url.searchParams)).toEqual({ categories: 'junior_women', seasons: '2025,2026', tracks: '3,7', conditions: 'wet', classes: 'wc,wch' })
  })

  it('passes the default ranking season and category explicitly', () => {
    render(<MemoryRouter initialEntries={['/ranking']}><RiderLink riderId="7">Anna</RiderLink></MemoryRouter>)
    const url = new URL(screen.getByRole('link').getAttribute('href')!, 'https://example.test')
    expect(Object.fromEntries(url.searchParams)).toEqual({ seasons: String(new Date().getUTCFullYear()), categories: 'elite_men' })
  })

  it.each(['/results/13', '/home', '/compare', '/live/13', '/ranking/riders/8'])('does not pass filters from %s', (path) => {
    render(<MemoryRouter initialEntries={[`${path}?categories=elite_women&seasons=2025&tracks=3&conditions=wet&classes=wc`]}><RiderLink riderId="7">Anna</RiderLink></MemoryRouter>)
    expect(screen.getByRole('link').getAttribute('href')).not.toContain('?')
  })

  it('stores the source page and shows country beside the name with only team below', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/results/13?category=elite_men']}>
        <Routes>
          <Route path="/results/:roundId" element={<RiderCell rider={{ id: '7', name: 'Anna FAST', country: 'POL', team: 'RACE TEAM', category: 'Elite Women', profileImageUrl: null }} />} />
          <Route path="/results/riders/:riderId" element={<LocationState />} />
        </Routes>
      </MemoryRouter>,
    )

    const riderLink = screen.getByRole('link', { name: 'Anna Fast' })
    expect(riderLink.parentElement).toHaveTextContent('Anna Fast(POL)')
    expect(screen.getByText('Race Team')).toBeInTheDocument()
    expect(screen.queryByText('Elite Women')).not.toBeInTheDocument()

    await user.click(riderLink)
    expect(screen.getByText(/"returnTo":"\/results\/13\?category=elite_men"/)).toBeInTheDocument()
    expect(screen.getByText(/"sourceSection":"\/results"/)).toBeInTheDocument()
  })

  it('returns to the source page after changing rider tabs', async () => {
    const user = userEvent.setup()
    const riderState = { returnTo: '/results/13', sourceSection: '/results' }

    render(
      <MemoryRouter initialEntries={[{ pathname: '/riders/7', state: riderState }]}>
        <Routes>
          <Route
            path="/riders/7/*"
            element={<>
              <Tabs label="Rider views" items={[{ label: 'Overview', to: '/riders/7' }, { label: 'Tracks', to: '/riders/7/tracks' }]} />
              <BackButton fallback="/ranking" useHistoryFallback={false} />
            </>}
          />
          <Route path="/results/13" element={<h1>Source results page</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: 'Tracks' }))
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('heading', { name: 'Source results page' })).toBeInTheDocument()
  })

  it('keeps the source section selected in the main menu', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/riders/7/tracks', state: { returnTo: '/compare', sourceSection: '/compare' } }]}>
        <TopNavigation />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Compare' })).toHaveAttribute('aria-current', 'page')
  })

  it('keeps the menu section in the URL without relying on location state', () => {
    render(
      <MemoryRouter initialEntries={['/ranking/riders/7/tracks?season=2026']}>
        <TopNavigation />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Ranking' })).toHaveAttribute('aria-current', 'page')
  })
})
