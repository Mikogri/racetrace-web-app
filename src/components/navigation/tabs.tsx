import { useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./tabs.module.css";

export function Tabs({
  items,
  label,
  preserveSearch = false,
}: {
  items: Array<{ label: string; to: string }>;
  label: string;
  preserveSearch?: boolean;
}) {
  const location = useLocation();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const activeIndex = items.findIndex(
    (item) =>
      location.pathname.replace(/\/$/, "") === item.to.replace(/\/$/, ""),
  );

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeTab = tabRefs.current[activeIndex];
      if (!activeTab) return;
      setIndicator({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    };

    updateIndicator();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(updateIndicator);
    const tabs = tabRefs.current.filter((tab) => tab !== null);
    tabs.forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  }, [activeIndex, items]);

  return (
    <nav className={styles.tabs} aria-label={label}>
      <span
        className={styles.indicator}
        aria-hidden="true"
        style={{
          width: `${indicator.width}px`,
          transform: `translateX(${indicator.left}px)`,
        }}
      />
      {items.map((item, index) => (
        <NavLink
          ref={(element) => {
            tabRefs.current[index] = element;
          }}
          key={item.to}
          to={
            preserveSearch
              ? { pathname: item.to, search: location.search }
              : item.to
          }
          state={location.state}
          end
          className={styles.tab}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
