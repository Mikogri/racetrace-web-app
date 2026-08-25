import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { joinClassNames } from '../../utils/join-class-names'
import styles from './button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'secondary',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-button-variant={variant}
      className={joinClassNames(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      {...props}
    >
      {children}
    </button>
  )
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
  size?: 'small' | 'medium'
}

export function IconButton({
  label,
  size = 'medium',
  className,
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={joinClassNames(styles.iconButton, styles[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
