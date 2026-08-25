import { Link } from 'react-router-dom'
import { routes } from '../../config/routes'
import styles from './footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link to={routes.privacyPolicy}>// Privacy Policy</Link>
        <span>// Data source: ChronoRace, Tissot Timing</span>
      </div>
    </footer>
  )
}
