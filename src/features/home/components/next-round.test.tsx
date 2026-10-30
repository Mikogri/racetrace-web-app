import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { homeRoundSchema, type HomeSummary } from '../api/get-home-data';
import { NextRoundSection } from './home-sections';

const summary: HomeSummary = {
  season: 2026, category: 'elite_men', nextRound: null, lastCompletedRound: null,
  lastRoundResults: [], seasonTopRated: [], currentStandings: [],
};

it('keeps the expected next season when the calendar year has advanced without new rounds', () => {
  render(<MemoryRouter><NextRoundSection summary={{ ...summary, season: 2027 }} nextSeason={2027} loading={false} /></MemoryRouter>);
  expect(screen.getByText(/Season over, see you 2027/)).toBeVisible();
  expect(screen.queryByText(/see you 2028/)).not.toBeInTheDocument();
});

it('shows the end-of-season message instead of empty round fields', () => {
  render(<MemoryRouter><NextRoundSection summary={summary} loading={false} /></MemoryRouter>);
  expect(screen.getByText(/Season over, see you 2027/)).toBeVisible();
  expect(screen.queryByText('Live Timing')).not.toBeInTheDocument();
  expect(screen.queryByText(/Round --/)).not.toBeInTheDocument();
});

it('does not announce the end of the season while loading', () => {
  render(<MemoryRouter><NextRoundSection summary={summary} loading /></MemoryRouter>);
  expect(screen.queryByText(/Season over, see you 2027/)).not.toBeInTheDocument();
});

it('does not announce the end of the season after a failed request', () => {
  render(<MemoryRouter><NextRoundSection summary={summary} loading={false} error /></MemoryRouter>);
  expect(screen.queryByText(/Season over, see you 2027/)).not.toBeInTheDocument();
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

it('keeps a loaded upcoming round visible', () => {
  const nextRound = homeRoundSchema.parse({ roundId: '7', season: 2026, status: 'upcoming', venueName: 'Leogang' });
  render(<MemoryRouter><NextRoundSection summary={{ ...summary, nextRound }} loading={false} /></MemoryRouter>);
  expect(screen.getByText('Leogang')).toBeVisible();
  expect(screen.getByText('Available')).toBeVisible();
  expect(screen.queryByText(/Season over, see you 2027/)).not.toBeInTheDocument();
});
