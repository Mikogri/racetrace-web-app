import type { EventClass } from '../../types/domain'
import { formatCompetitionClassAbbreviation } from '../../utils/competition-classes'
import styles from './event-class-badge.module.css'

function getLabel(eventClass: EventClass) {
  return formatCompetitionClassAbbreviation({ code: eventClass })
}

export function EventClassBadge({ eventClass }: { eventClass: EventClass }) {
  return <span className={styles[eventClass]}>{getLabel(eventClass)}</span>
}
