import type { CSSProperties } from 'react'
import styles from './progress-bar.module.css'

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const normalizedValue = Math.min(100, Math.max(0, value))
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
    >
      <span className={styles.value} style={{ '--progress-value': `${normalizedValue}%` } as CSSProperties} />
    </div>
  )
}
