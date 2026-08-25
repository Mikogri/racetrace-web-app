import type { InputHTMLAttributes } from 'react'
import styles from './checkbox.module.css'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className={styles.label}>
      <input type="checkbox" className={styles.input} {...props} />
      <span>{label}</span>
    </label>
  )
}
