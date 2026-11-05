import { startTransition, useOptimistic } from 'react'
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
  // The pressed option follows the click at once, while the parent's update (URL, data) runs as a transition.
  const [shownValue, setShownValue] = useOptimistic(value)

  return (
    <div className={styles.control} role="group" aria-label={label}>
      {options.map((option) => {
        const button = (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            className={styles.option}
            aria-pressed={shownValue === option.value}
            aria-label={option.tooltip ?? option.label}
            onClick={() => {
              if (option.value === shownValue) return
              startTransition(() => {
                setShownValue(option.value)
                onChange(option.value)
              })
            }}
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
