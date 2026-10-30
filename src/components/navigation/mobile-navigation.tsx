import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoMark from "../../assets/logos/racetrace-mark.png";
import { navigationItems } from "../../config/routes";
import { joinClassNames } from "../../utils/join-class-names";
import { IconButton } from "../ui/button";
import {
  getRiderNavigationState,
  isNavigationSectionActive,
} from "./rider-navigation-state";
import styles from "./mobile-navigation.module.css";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const riderSourceSection = getRiderNavigationState(
    location.state,
  )?.sourceSection;

  return (
    <nav className={styles.navigation} aria-label="Mobile navigation">
      <NavLink
        to="/"
        className={styles.brand}
        aria-label="Race Trace MTB home"
      >
        <span className={styles.logoViewport}>
          <img src={logoMark} alt="" className={styles.logo} />
        </span>
      </NavLink>
      <IconButton
        label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation-list"
        onClick={() => setOpen((current) => !current)}
        size="small"
      >
        <span aria-hidden="true">{open ? "×" : "≡"}</span>
      </IconButton>
      {open ? (
        <div id="mobile-navigation-list" className={styles.menu}>
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
                className={joinClassNames(
                  styles.link,
                  isActive && styles.active,
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}
