import { AppTooltip } from '../overlays/tooltip'
import styles from './segmented-control.module.css'

export type SegmentedOption<T extends string> = {
  value: T
  label: string
  tooltip?: string
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string
  options: Array<SegmentedOption<T>>
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}) {
  return (
    <div className={styles.control} role="group" aria-label={label}>
      {options.map((option) => {
        const button = (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            className={styles.option}
            aria-pressed={value === option.value}
            aria-label={option.tooltip ?? option.label}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )

        return option.tooltip && option.tooltip !== option.label ? (
          <AppTooltip content={option.tooltip} key={option.value}>
            {button}
          </AppTooltip>
        ) : button
      })}
    </div>
  )
}
