import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import closeIcon from '../../assets/icons/close.png'
import { joinClassNames } from '../../utils/join-class-names'
import { IconButton } from '../ui/button'
import { Typography } from '../ui/typography'
import styles from './dialog.module.css'

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type DialogProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  initialFocusRef?: RefObject<HTMLElement | null>
  closeOnBackdrop?: boolean
  className?: string
}

export function Dialog({
  open,
  title,
  onClose,
  children,
  initialFocusRef,
  closeOnBackdrop = true,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const currentPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => {
      initialFocusRef?.current?.focus()
      if (!initialFocusRef?.current) {
        dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus()
      }
    })

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      previousFocusRef.current?.focus()
    }
  }, [initialFocusRef, open])

  if (!open) return null

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.currentTarget === event.target) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={joinClassNames(styles.dialog, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
      >
        <ModalHeader title={title} titleId={titleId} onClose={onClose} />
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function ModalHeader({
  title,
  titleId,
  onClose,
}: {
  title: string
  titleId: string
  onClose: () => void
}) {
  return (
    <header className={styles.header}>
      <Typography as="h2" variant="panelTitle" id={titleId}>
        {title}
      </Typography>
      <IconButton label="Close dialog" size="small" onClick={onClose}>
        <img className={styles.closeIcon} src={closeIcon} alt="" />
      </IconButton>
    </header>
  )
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <footer className={styles.footer}>{children}</footer>
}
