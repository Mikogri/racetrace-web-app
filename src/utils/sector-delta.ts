import type { SectorDeltaState } from '../types/domain'

export function getSectorDeltaState(
  value: number | null,
  incident = false,
): SectorDeltaState {
  if (incident) return 'incident'
  if (value === null || !Number.isFinite(value)) return 'missing'
  if (Math.abs(value) < 0.0005) return 'neutral'
  return value < 0 ? 'gain' : 'loss'
}
