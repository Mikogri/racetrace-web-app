import { Panel } from '../ui/panel'
import { Typography } from '../ui/typography'
import styles from './data-placeholder.module.css'

export function DataPlaceholder({
  title,
  description = 'This section is ready for its API response contract.',
}: {
  title: string
  description?: string
}) {
  return (
    <Panel className={styles.placeholder}>
      <span className={styles.marker} aria-hidden="true">
        //
      </span>
      <div className={styles.copy}>
        <Typography as="h3" variant="panelTitle">
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </div>
    </Panel>
  )
}
