import { joinClassNames } from '../../utils/join-class-names'
import { getSectorDeltaState } from '../../utils/sector-delta'
import styles from './sector-delta-cell.module.css'

export function SectorDeltaCell({
  value,
  incident = false,
}: {
  value: number | null
  incident?: boolean
}) {
  const state = getSectorDeltaState(value, incident)
  const label =
    state === 'incident'
      ? 'Incident'
      : state === 'missing'
        ? '—'
        : `${value !== null && value > 0 ? '+' : ''}${value?.toFixed(3) ?? '—'}`

  return (
    <span className={joinClassNames(styles.cell, styles[state])} data-state={state}>
      {label}
    </span>
  )
}
