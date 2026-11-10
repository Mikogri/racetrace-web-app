import { Children, Fragment, type HTMLAttributes, type ReactNode } from "react";
import { joinClassNames } from "../../utils/join-class-names";
import { Typography } from "./typography";
import styles from "./panel.module.css";
import { AppTooltip } from "../overlays/tooltip";
import infoIcon from "../../assets/info-hexagon.svg";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: "none" | "compact" | "default";
  /** Drops the panel's surface, edge and shadow, e.g. around charts. */
  bare?: boolean;
};

export function Panel({
  children,
  padding = "default",
  bare = false,
  className,
  ...props
}: PanelProps) {
  return (
    <div
      className={joinClassNames(
        styles.panel,
        bare && styles.bare,
        styles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  description,
  info,
}: {
  title: string;
  description?: string;
  info?: string;
}) {
  const hasMarker = title.trimStart().startsWith("//");
  const visibleTitle = hasMarker
    ? title.trimStart().slice(2).trimStart()
    : title;
  return (
    <div
      className={joinClassNames(styles.header, info && styles.headerWithInfo)}
    >
      <Typography as="h2" variant="panelTitle">
        {hasMarker ? <span className={styles.titleMarker}>//</span> : null}
        {hasMarker ? " " : null}
        {visibleTitle}
      </Typography>
      {info && (
        <AppTooltip content={info}>
          <button
            type="button"
            className={styles.info}
            aria-label={`About ${visibleTitle}`}
          >
            <img src={infoIcon} alt="" width={16} height={16} />
          </button>
        </AppTooltip>
      )}
      {description ? (
        <Typography variant="caption" className={styles.headerDescription}>
          {description}
        </Typography>
      ) : null}
    </div>
  );
}

export function SummaryBanner({
  children,
  loading = false,
}: {
  children: ReactNode;
  loading?: boolean;
}) {
  const text = Children.toArray(children)
    .filter(
      (child): child is string | number =>
        typeof child === "string" || typeof child === "number",
    )
    .join("");
  const items = text
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div
      className={styles.summary}
      {...(loading ? { role: "status", "aria-label": "Loading" } : {})}
    >
      {loading
        ? Array.from({ length: 4 }, (_, index) => (
            <Fragment key={index}>
              <span className={styles.summarySkeleton} aria-hidden="true" />
              {index < 3 ? (
                <i className={styles.summaryDot} aria-hidden="true" />
              ) : null}
            </Fragment>
          ))
        : items.map((item, index) => (
            <Fragment key={`${item}-${index}`}>
              <span>{item}</span>
              {index < items.length - 1 ? (
                <i className={styles.summaryDot} aria-hidden="true" />
              ) : null}
            </Fragment>
          ))}
    </div>
  );
}
