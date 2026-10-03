import type { ReactNode } from "react";
import { TableFeedbackState } from "../../../components/feedback/states";
import styles from "../rider-pages.module.css";

export function RiderTableContent({
  hasDataError,
  isEmpty,
  onRetry,
  children,
}: {
  hasDataError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  children: ReactNode;
}) {
  let content = children;
  if (hasDataError) {
    content = <TableFeedbackState type="error" onRetry={onRetry} animate={false} />;
  } else if (isEmpty) {
    content = <TableFeedbackState type="empty" animate={false} />;
  }

  return <div className={`${styles.content} ${styles.resultsPage}`}>{content}</div>;
}
