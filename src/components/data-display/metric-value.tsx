import type { ReactNode } from 'react'
import styles from './metric-value.module.css'

export function MetricValue({ value, suffix }: { value: ReactNode | null; suffix?: string }) {
  return (
    <span className={styles.value}>
      {value ?? '—'}
      {value !== null && suffix ? <span className={styles.suffix}>{suffix}</span> : null}
    </span>
  )
}
