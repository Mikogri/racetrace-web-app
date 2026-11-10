import type { HTMLAttributes } from "react";
import { joinClassNames } from "../../utils/join-class-names";
import { getRatingTone } from "../../utils/rating";
import { formatOneDecimal } from "../../utils/formatters";
import { AnimatedNumber } from "./animated-number";
import styles from "./rating-value.module.css";

const sizeClasses = {
  small: styles.sizesmall,
  medium: styles.sizemedium,
  large: styles.sizelarge,
} as const;

type RatingValueProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  value: number | null;
  format?: "integer" | "decimal" | ((value: number) => string);
  showSuffix?: boolean;
  size?: "small" | "medium" | "large";
  capAtHigh?: boolean;
  animate?: boolean;
  animationDuration?: number;
  animationLoop?: boolean;
};

export function RatingValue({
  value,
  format = "decimal",
  showSuffix = false,
  size = "small",
  capAtHigh = false,
  animate = false,
  animationDuration = 450,
  animationLoop = false,
  className,
  ...props
}: RatingValueProps) {
  if (value === null || !Number.isFinite(value)) {
    return (
      <span
        className={joinClassNames(
          styles.value,
          styles.missing,
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        —
      </span>
    );
  }

  const formatValue = (currentValue: number) =>
    typeof format === "function"
      ? format(currentValue)
      : format === "integer"
        ? Math.round(currentValue).toString()
        : formatOneDecimal(currentValue);
  const formatted = formatValue(value);

  const ratingTone = getRatingTone(value);
  const cappedToneClass = (currentValue: number) => {
    const displayedValue = Math.round(currentValue * 10) / 10;

    return displayedValue >= 75
      ? styles.cappedTop
      : displayedValue > 55
        ? styles.medium
        : styles.low;
  };
  const displayedToneClass = capAtHigh
    ? cappedToneClass(value)
    : styles[ratingTone];
  const animatedToneClass = (currentValue: number) => {
    const currentTone = getRatingTone(currentValue);
    return capAtHigh ? cappedToneClass(currentValue) : styles[currentTone];
  };

  return (
    <span
      className={joinClassNames(
        styles.value,
        !animate && displayedToneClass,
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {animate ? (
        <AnimatedNumber
          value={value}
          duration={animationDuration}
          format={formatValue}
          getClassName={animatedToneClass}
          loop={animationLoop}
        />
      ) : (
        formatted
      )}
      {showSuffix ? <span className={styles.suffix}>/100</span> : null}
    </span>
  );
}
