import styles from "./live-status-badge.module.css";

export function LiveStatusBadge({ status }: { status: string | null | undefined }) {
  const normalized = status?.trim().toLowerCase() ?? "unknown";
  const isLive = ["live", "active", "running"].includes(normalized);
  const isCompleted = ["completed", "finished", "final"].includes(normalized);
  const isUpcoming = ["scheduled", "upcoming", "confirmed"].includes(normalized);
  const label = isLive ? "Live" : isCompleted ? "Completed" : isUpcoming ? "Upcoming" : normalized || "Unknown";

  return (
    <span
      className={`${styles.badge} ${isLive ? styles.live : isCompleted ? styles.completed : isUpcoming ? styles.upcoming : styles.neutral}`}
    >
      {isLive ? <span className={styles.dot} aria-hidden="true" /> : null}
      {label}
    </span>
  );
}
