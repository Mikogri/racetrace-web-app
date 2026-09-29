import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { homeRoundSchema, type RoundProfile } from '../api/get-home-data';
import { FieldSpreadSection, TrackFingerprintSection } from './home-sections';

it.each([FieldSpreadSection, TrackFingerprintSection])('opens Analytics from the Home analysis link', (Section) => {
  const profile: RoundProfile = {
    season: 2026, category: 'elite_men', sessionId: null, results: [], analytics: null,
    round: homeRoundSchema.parse({ roundId: '37', season: 2026, status: 'completed' }),
    fieldSpread: { fieldSize: 0, classification: 'unavailable', p10GapPercent: null, points: [] },
    trackFingerprint: { mostDecisiveSector: null, sectors: [], positionSpread: [] },
  };
  render(<MemoryRouter><Section profile={profile} loading={false} error={false} category="elite_men" onCategoryChange={() => {}} /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Explore Round Analysis/ })).toHaveAttribute('href', '/results/rounds/37?tab=analyze');
});
