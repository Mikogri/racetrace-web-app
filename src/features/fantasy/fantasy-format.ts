import type { SortDirection } from '../../components/data-display/data-table'
import type { FantasyRider } from './api/get-fantasy'

export type FantasySort = 'expectedFantasyPoints' | 'price' | 'value'

export function fantasyValue(rider: FantasyRider) {
  return rider.price !== null && rider.price > 0 && rider.expectedFantasyPoints !== null
    ? rider.expectedFantasyPoints / rider.price * 100_000
    : null
}

export function sortFantasyRiders(riders: FantasyRider[], sort: FantasySort, direction: SortDirection) {
  return [...riders].sort((left, right) => {
    const a = sort === 'value' ? fantasyValue(left) : left[sort]
    const b = sort === 'value' ? fantasyValue(right) : right[sort]
    // Missing projections/prices never outrank valid data, in either direction.
    if (a === null && b !== null) return 1
    if (b === null && a !== null) return -1
    return ((a ?? 0) - (b ?? 0)) * (direction === 'asc' ? 1 : -1)
      || left.name.localeCompare(right.name)
      || left.pinkbikeExternalId.localeCompare(right.pinkbikeExternalId)
  })
}

export const fantasyMoney = (value: number | null | undefined) => value == null ? '--'
  : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
export function fantasyNumber(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return '--'
  if (Math.abs(value) > 999.99) return value.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 2 })
  const rounded = Number(value.toPrecision(3))
  const decimals = Math.abs(rounded) >= 100 ? 0 : Math.abs(rounded) >= 10 ? 1 : 2
  return rounded.toFixed(decimals)
}

export function fantasyDate(value: string | null | undefined) {
  if (!value) return '--'
  // Round dates are calendar dates in the event's timezone, not UTC instants.
  // Converting midnight +02:00 to UTC would incorrectly show the previous day.
  const calendarDate = /^\d{4}-\d{2}-\d{2}/.exec(value)?.[0]
  const date = new Date(calendarDate ? `${calendarDate}T00:00:00Z` : value)
  return Number.isNaN(date.getTime()) ? '--' : date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}
