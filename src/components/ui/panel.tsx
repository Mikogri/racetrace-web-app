import { Children, Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { joinClassNames } from '../../utils/join-class-names'
import { Typography } from './typography'
import styles from './panel.module.css'

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  padding?: 'none' | 'compact' | 'default'
}

export function Panel({ children, padding = 'default', className, ...props }: PanelProps) {
  return (
    <div className={joinClassNames(styles.panel, styles[padding], className)} {...props}>
      {children}
    </div>
  )
}

export function PanelHeader({ title, description }: { title: string; description?: string }) {
  const hasMarker = title.trimStart().startsWith('//')
  const visibleTitle = hasMarker ? title.trimStart().slice(2).trimStart() : title
  return (
    <div className={styles.header}>
      <Typography as="h2" variant="panelTitle">
        {hasMarker ? <span className={styles.titleMarker}>//</span> : null}
        {hasMarker ? ' ' : null}
        {visibleTitle}
      </Typography>
      {description ? <Typography variant="caption">{description}</Typography> : null}
    </div>
  )
}

export function MetricPanel({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Panel padding="compact" className={styles.metric}>
      <Typography variant="caption">{label}</Typography>
      <Typography as="div" variant="data" className={styles.metricValue}>
        {value}
      </Typography>
    </Panel>
  )
}

export function SummaryBanner({ children, loading = false }: { children: ReactNode; loading?: boolean }) {
  const text = Children.toArray(children)
    .filter((child): child is string | number => typeof child === 'string' || typeof child === 'number')
    .join('')
  const items = text.split('·').map((item) => item.trim()).filter(Boolean)

  return (
    <div className={styles.summary} {...(loading ? { role: 'status', 'aria-label': 'Loading' } : {})}>
      {loading
        ? Array.from({ length: 4 }, (_, index) => (
            <Fragment key={index}>
              <span className={styles.summarySkeleton} aria-hidden="true" />
              {index < 3 ? <i className={styles.summaryDot} aria-hidden="true" /> : null}
            </Fragment>
          ))
        : items.map((item, index) => (
            <Fragment key={`${item}-${index}`}>
              <span>{item}</span>
              {index < items.length - 1 ? <i className={styles.summaryDot} aria-hidden="true" /> : null}
            </Fragment>
          ))}
    </div>
  )
}

export function Divider() {
  return <hr className={styles.divider} />
}
