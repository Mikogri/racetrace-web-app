import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { normalizeChronoRacePayload, type LiveSession } from '../api/get-live';
import { LiveChampionship } from './live-championship';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const session = { id: '3', roundId: '38', contextName: '20261002_mtb', name: 'Final', sessionType: 'final', category: 'elite_men', provider: 'chronorace' } as LiveSession;

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  const snapshot = {
    status: 'live', results: normalizeChronoRacePayload({ Riders: { '1': { UciRiderId: '100', GivenName: 'A' } }, Results: [{ RaceNr: 1, Position: 1, RaceTime: 100000 }] }, session),
  };
  return render(<QueryClientProvider client={client}><LiveChampionship session={session} catalog={[session]} snapshot={snapshot} /></QueryClientProvider>);
}

describe('live championship panel', () => {
  it('does not render or project outside the season finale', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ eligible: false, session_types: [] });
    const post = vi.spyOn(apiClient, 'post');
    const view = setup();
    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(view.container).toBeEmptyDOMElement();
    expect(post).not.toHaveBeenCalled();
  });
  it('renders the server-calculated top two, lead and title status', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ eligible: true, session_types: ['final'] });
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      items: [{ rider_id: '1', uci_id: '100', name: 'Loic BRUNI', points: 1200 }, { rider_id: '2', uci_id: '200', name: 'Asa VERMETTE', points: 1150 }],
      lead: 50, can_change: true, status: 'open',
    });
    setup();
    expect(await screen.findByText('Loic Bruni')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('50 pts lead')).toBeInTheDocument();
    expect(screen.getByText('Title still open')).toBeInTheDocument();
  });
});
