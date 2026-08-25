import { joinClassNames } from '../../utils/join-class-names'
import styles from './podium-position.module.css'

type PodiumPositionValue = 1 | 2 | 3

const positionClasses = {
  1: styles.position1,
  2: styles.position2,
  3: styles.position3,
} as const

export function PodiumPosition({ position }: { position: PodiumPositionValue }) {
  return <span className={joinClassNames(styles.position, positionClasses[position])}>{position}</span>
}
