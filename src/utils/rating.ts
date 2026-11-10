import type { RatingTone } from "../types/domain";

export function getRatingTone(value: number): RatingTone {
  const displayedValue = Math.round(value * 10) / 10;

  if (displayedValue >= 90) return "top";
  if (displayedValue >= 80) return "veryHigh";
  if (displayedValue >= 70) return "high";
  if (displayedValue >= 50) return "medium";
  return "low";
}
