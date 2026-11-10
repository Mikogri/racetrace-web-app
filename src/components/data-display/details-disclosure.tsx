import { useId, useState, type ReactNode } from "react";
import styles from "./request-details.module.css";

/** Shared presentation for request diagnostics and API data notices. */
export function DetailsDisclosure({
  title,
  children,
  defaultExpanded = false,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const id = useId();
  return (
    <div className={styles.details}>
      <button
        className={styles.header}
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>{title}</span>
        <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
          <path d="m3 4.5 3 3 3-3" />
        </svg>
      </button>
      <div
        id={id}
        aria-hidden={!expanded}
        inert={!expanded}
        className={`${styles.content} ${expanded ? styles.contentExpanded : ""}`}
      >
        <div className={styles.contentInner}>
          <div className={styles.divider} />
          {children}
        </div>
      </div>
    </div>
  );
}
