import type { ReactNode } from "react";
import { joinClassNames } from "../../utils/join-class-names";
import { Typography } from "../ui/typography";
import failedIcon from "../../assets/icons/failed.png";
import noDataIcon from "../../assets/icons/no-data.png";
import styles from "./states.module.css";

export function LoadingState({
  label = "Loading",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={joinClassNames(
        styles.state,
        styles.loadingState,
        compact && styles.compact,
      )}
      role="status"
    >
      <span className={styles.spinner} aria-hidden="true" />
      <Typography>{label}</Typography>
    </div>
  );
}

export function TableFeedbackState({
  type,
  onRetry,
  label: customLabel,
  description,
  retryLabel = "Retry",
  animate = true,
  compact = false,
  action,
}: {
  type: "loading" | "error" | "empty";
  onRetry?: () => void;
  label?: string;
  description?: string;
  retryLabel?: string;
  animate?: boolean;
  compact?: boolean;
  action?: ReactNode;
}) {
  const label =
    customLabel ??
    (type === "loading"
      ? "Loading"
      : type === "empty"
        ? "No data available"
        : "Failed to load data");

  return (
    <div
      className={joinClassNames(
        styles.tableFeedback,
        compact && styles.compactTableFeedback,
        type !== "loading" && animate && styles.enterState,
      )}
      role={type === "error" ? "alert" : "status"}
    >
      <div
        className={joinClassNames(
          styles.tableFeedbackContent,
          type === "loading" ? styles.tableLoadingContent : undefined,
        )}
      >
        {type === "loading" ? (
          <>
            <span className={styles.tableSpinner} aria-hidden="true" />
            <p className={styles.tableFeedbackLabel}>{label}</p>
          </>
        ) : (
          <>
            <img
              className={styles.tableStateImage}
              src={type === "error" ? failedIcon : noDataIcon}
              alt=""
            />
            {type === "error" ? (
              <div className={styles.tableFeedbackCopy}>
                <p
                  className={joinClassNames(
                    styles.tableFeedbackLabel,
                    styles.tableErrorLabel,
                  )}
                >
                  {label}
                </p>
                <p className={styles.tableFeedbackDescription}>
                  {description ?? "Couldn't load the data right now."}
                </p>
              </div>
            ) : (
              <div className={styles.tableFeedbackCopy}>
                <p
                  className={joinClassNames(
                    styles.tableFeedbackLabel,
                    styles.tableErrorLabel,
                  )}
                >
                  {label}
                </p>
                <p className={styles.tableFeedbackDescription}>
                  {description ?? "Try adjusting or clearing your filters."}
                </p>
              </div>
            )}
            {type === "error" && onRetry ? (
              <button
                className={styles.tableRetry}
                type="button"
                onClick={onRetry}
              >
                {retryLabel}
              </button>
            ) : null}
            {action}
          </>
        )}
      </div>
    </div>
  );
}

export function ErrorState({
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return <TableFeedbackState type="error" {...(onRetry ? { onRetry } : {})} />;
}

export function InlineError({ children }: { children: ReactNode }) {
  return (
    <p className={styles.inlineError} role="alert">
      {children}
    </p>
  );
}
