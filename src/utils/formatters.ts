const timeFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatOneDecimal(value: number): string {
  return Math.round(value * 10) / 10 === 100 ? '100' : value.toFixed(1)
}

export function formatRaceTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return '—'
  const roundedSeconds = Math.round(seconds * 100) / 100
  const minutes = Math.floor(roundedSeconds / 60)
  const remaining = roundedSeconds - minutes * 60
  return `${minutes}:${timeFormatter.format(remaining).padStart(5, '0')}`
}

export function formatGap(seconds: number | null | undefined, fractionDigits = 3): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return '—'
  if (seconds === 0) return 'Winner'
  return `${seconds > 0 ? '+' : '−'}${Math.abs(seconds).toFixed(fractionDigits)}`
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const dateWithoutYearFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function formatDateRange(start: string | null | undefined, end: string | null | undefined) {
  const startLabel = formatDate(start)
  const endLabel = formatDate(end)
  if (startLabel === '—') return endLabel
  if (endLabel === '—' || startLabel === endLabel) return startLabel

  const startDate = new Date(`${start?.slice(0, 10)}T00:00:00Z`)
  const endDate = new Date(`${end?.slice(0, 10)}T00:00:00Z`)
  if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()) && startDate.getUTCFullYear() === endDate.getUTCFullYear()) {
    return `${dateWithoutYearFormatter.format(startDate)} - ${endLabel}`
  }

  return `${startLabel} - ${endLabel}`
}
