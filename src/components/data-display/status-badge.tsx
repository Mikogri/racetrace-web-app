import type { ResultStatus } from "../../types/domain";
import { assertNever } from "../../utils/assert-never";
import { joinClassNames } from "../../utils/join-class-names";
import styles from "./status-badge.module.css";

export type StatusTone =
  "success" | "warning" | "error" | "info" | "neutral" | "live" | "result";

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span className={joinClassNames(styles.badge, styles[tone])}>{label}</span>
  );
}

export function ResultStatusBadge({ status }: { status: ResultStatus }) {
  switch (status) {
    case "classified":
      return <StatusBadge label="Classified" tone="success" />;
    case "dns":
      return <StatusBadge label="DNS" tone="result" />;
    case "dnf":
      return <StatusBadge label="DNF" tone="result" />;
    case "dsq":
      return <StatusBadge label="DSQ" tone="result" />;
    default:
      return assertNever(status);
  }
}
