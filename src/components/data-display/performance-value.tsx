import type { ComponentProps } from 'react'
import { RatingValue } from './rating-value'
import { formatOneDecimal } from '../../utils/formatters'

type Props = Omit<ComponentProps<typeof RatingValue>, 'format' | 'showSuffix'> & {
  percent?: boolean
}

export function PerformanceValue({ value, percent = false, ...props }: Props) {
  return (
    <RatingValue
      value={value}
      format={percent ? (score) => `${formatOneDecimal(score)}%` : 'decimal'}
      {...props}
      capAtHigh={percent}
    />
  )
}
