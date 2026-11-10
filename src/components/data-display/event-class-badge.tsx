import type { ReactNode } from "react";
import {
  formatCompetitionClassAbbreviation,
  getCompetitionClassColors,
  type CompetitionClassDisplay,
} from "../../utils/competition-classes";
import { joinClassNames } from "../../utils/join-class-names";
import styles from "./event-class-badge.module.css";

export function EventClassBadge({
  className,
  children,
  ...eventClass
}: CompetitionClassDisplay & {
  className?: string;
  children?: ReactNode;
}) {
  const colors = getCompetitionClassColors(eventClass);
  return (
    <span
      className={joinClassNames(styles.badge, className)}
      style={{ color: colors.text, borderColor: colors.border }}
    >
      {children ?? formatCompetitionClassAbbreviation(eventClass)}
    </span>
  );
}
