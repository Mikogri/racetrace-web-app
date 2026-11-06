import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { usePlotArea } from "recharts";
import styles from "./plot-area-blur.module.css";

/**
 * Blurs the page backdrop behind the plot area of a Recharts chart (not behind the axis labels).
 * SVG has no backdrop-filter, so a positioned div is placed in the chart wrapper under the SVG.
 */
export function PlotAreaBlur() {
  const plotArea = usePlotArea();
  const [wrapper, setWrapper] = useState<Element | null>(null);
  const anchorRef = useCallback((node: SVGGElement | null) => setWrapper(node?.closest(".recharts-wrapper") ?? null), []);

  return (
    <g ref={anchorRef} aria-hidden="true">
      {wrapper && plotArea && plotArea.width > 0 && plotArea.height > 0
        ? createPortal(
            <div
              className={styles.blur}
              style={{ left: plotArea.x, top: plotArea.y, width: plotArea.width, height: plotArea.height }}
            />,
            wrapper,
          )
        : null}
    </g>
  );
}
