import { startTransition, useCallback, useEffect, useId, useOptimistic, useRef, useState, type KeyboardEvent } from 'react'
import type { FilterOption } from '../../types/domain'
import { FilterButton } from './filter-button'
import { FilterPopover } from './filter-popover'
import styles from './multi-select.module.css'

type MultiSelectProps = {
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  mode?: 'single' | 'multiple'
  disabled?: boolean
  wideMenu?: boolean
}

export function MultiSelect({
  label,
  options,
  selectedValues,
  onSelectionChange,
  mode = 'multiple',
  disabled = false,
  wideMenu = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [draftValues, setDraftValues] = useState(selectedValues)
  // The committed choice shows at once, while the parent's update (URL, data) runs as a transition.
  const [committedValues, setCommittedValues] = useOptimistic(selectedValues)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const listboxId = useId()

  const commitDraft = useCallback(() => {
    if (sameValues(draftValues, committedValues)) return
    startTransition(() => {
      setCommittedValues(draftValues)
      onSelectionChange(draftValues)
    })
  }, [committedValues, draftValues, onSelectionChange, setCommittedValues])

  const closeAndCommit = useCallback(() => {
    commitDraft()
    setOpen(false)
  }, [commitDraft])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeAndCommit()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [closeAndCommit, open])

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus()
  }, [activeIndex, open])

  const toggleValue = (value: string) => {
    const isSelected = draftValues.includes(value)
    if (mode === 'single') {
      const nextValues = isSelected ? [] : [value]
      setDraftValues(nextValues)
      setOpen(false)
      startTransition(() => {
        setCommittedValues(nextValues)
        onSelectionChange(nextValues)
      })
      triggerRef.current?.focus()
      return
    }
    setDraftValues(
      isSelected ? draftValues.filter((item) => item !== value) : [...draftValues, value],
    )
  }

  const moveActive = (direction: 1 | -1) => {
    if (options.length === 0) return
    setActiveIndex((current) => (current + direction + options.length) % options.length)
  }

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, value: string) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : Math.max(options.length - 1, 0))
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeAndCommit()
      triggerRef.current?.focus()
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleValue(value)
    }
  }

  const summaryValues = open ? draftValues : committedValues
  const summary = summaryValues.length > 0 ? `${label} (${summaryValues.length})` : label

  return (
    <div className={styles.root} ref={rootRef}>
      <FilterButton
        ref={triggerRef}
        expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => {
          if (open) closeAndCommit()
          else {
            setDraftValues(committedValues)
            setOpen(true)
          }
          setActiveIndex(Math.max(options.findIndex((option) => committedValues.includes(option.value)), 0))
        }}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault()
            setDraftValues(committedValues)
            setOpen(true)
          }
        }}
      >
        {summary}
      </FilterButton>
      {open ? (
        <FilterPopover className={wideMenu ? styles.wideMenu : undefined} id={listboxId} role="listbox" aria-label={label} aria-multiselectable={mode === 'multiple'}>
          <div className={styles.options}>
            {options.length === 0 ? <span className={styles.empty}>No options available</span> : null}
            {options.map((option, index) => {
              const selected = draftValues.includes(option.value)
              return (
                <button
                  key={option.value}
                  ref={(element) => {
                    optionRefs.current[index] = element
                  }}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={styles.option}
                  onClick={() => toggleValue(option.value)}
                  onKeyDown={(event) => handleOptionKeyDown(event, option.value)}
                >
                  <span className={styles.check}>
                    {selected ? <svg viewBox="0 0 15 15" aria-hidden="true"><path d="m3 7.5 3 3 6-6" /></svg> : null}
                  </span>
                  <span className={styles.optionText}>
                    <span>{option.label}</span>
                    {option.subtitle ? <span className={styles.subtitle}>{option.subtitle}</span> : null}
                  </span>
                </button>
              )
            })}
          </div>
        </FilterPopover>
      ) : null}
    </div>
  )
}

function sameValues(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}
