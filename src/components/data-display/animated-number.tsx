import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (value: number) => string;
  getClassName?: (value: number) => string;
  loop?: boolean;
};

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

export function AnimatedNumber({
  value,
  duration = 450,
  decimals = 0,
  format,
  getClassName,
  loop = false,
}: AnimatedNumberProps) {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [displayValue, setDisplayValue] = useState(() =>
    reducedMotion ? value : 0,
  );

  useEffect(() => {
    if (reducedMotion || duration <= 0) return;

    const startedAt = performance.now();
    let animationFrame = 0;
    const animate = (now: number) => {
      const elapsed = (now - startedAt) / duration;
      const progress = loop ? elapsed % 1 : Math.min(1, elapsed);
      setDisplayValue(value * easeOutCubic(progress));
      if (loop || progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, loop, reducedMotion, value]);

  const formatValue = (current: number) =>
    format
      ? format(current)
      : decimals === 0
        ? Math.round(current).toString()
        : current.toFixed(decimals);
  const currentValue = reducedMotion ? value : displayValue;
  const visibleValue = formatValue(currentValue);

  return (
    <>
      <span className={getClassName?.(currentValue)} aria-hidden="true">
        {visibleValue}
      </span>
      <span className="srOnly">{formatValue(value)}</span>
    </>
  );
}
