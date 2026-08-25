import { Link, NavLink, useLocation } from "react-router-dom";
import logoMark from "../../assets/logos/racetrace-mark.png";
import { navigationItems } from "../../config/routes";
import { joinClassNames } from "../../utils/join-class-names";
import {
  getRiderNavigationState,
  isNavigationSectionActive,
} from "./rider-navigation-state";
import styles from "./top-navigation.module.css";

export function TopNavigation() {
  const location = useLocation();
  const riderSourceSection = getRiderNavigationState(
    location.state,
  )?.sourceSection;

  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      <div className={styles.inner}>
        <NavLink
          to="/"
          className={styles.brand}
          aria-label="RaceTrace Analytics home"
        >
          <span className={styles.logoViewport}>
            <img src={logoMark} alt="" className={styles.logo} />
          </span>
        </NavLink>
        <div className={styles.links}>
          {navigationItems.map((item) => {
            const isActive = isNavigationSectionActive(
              location.pathname,
              item.to,
              riderSourceSection,
            );
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className={joinClassNames(
                  styles.link,
                  isActive && styles.active,
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <span className={styles.balance} aria-hidden="true" />
      </div>
    </nav>
  );
}
