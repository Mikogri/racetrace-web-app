import type { RatingTone } from '../types/domain'

export function getRatingTone(value: number): RatingTone {
  if (value >= 90) return 'top'
  if (value >= 80) return 'veryHigh'
  if (value >= 70) return 'high'
  if (value >= 50) return 'medium'
  return 'low'
}
