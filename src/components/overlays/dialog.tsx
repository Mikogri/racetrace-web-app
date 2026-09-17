import {
  useId,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import closeIcon from '../../assets/icons/close.png'
import { joinClassNames } from '../../utils/join-class-names'
import { IconButton } from '../ui/button'
import { Typography } from '../ui/typography'
import { useDialogFocus } from './use-dialog-focus'
import styles from './dialog.module.css'

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
  const { dialogRef, handleKeyDown } = useDialogFocus(open, onClose, initialFocusRef)
  const titleId = useId()

  if (!open) return null

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
      <IconButton className={styles.closeButton} label="Close dialog" size="small" onClick={onClose}>
        <img className={styles.closeIcon} src={closeIcon} alt="" />
      </IconButton>
    </header>
  )
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <footer className={styles.footer}>{children}</footer>
}
