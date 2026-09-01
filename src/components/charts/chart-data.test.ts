import { describe, expect, it } from "vitest";
import {
  metricAxisConfiguration,
  positionChartPointKey,
} from "./chart-data";

describe("metricAxisConfiguration", () => {
  it("adds a compact margin around the visible metric values", () => {
    expect(metricAxisConfiguration([50, 72, 88]).domain).toEqual([40, 100]);
  });

  it("keeps metric axes inside the zero to one hundred range", () => {
    expect(metricAxisConfiguration([3, 97]).domain).toEqual([0, 100]);
  });

  it("uses the full scale for an empty chart", () => {
    expect(metricAxisConfiguration([])).toEqual({
      domain: [0, 100],
      ticks: [0, 25, 50, 75, 100],
    });
  });
});

describe("positionChartPointKey", () => {
  it("distinguishes repeated round and session labels from different seasons", () => {
    const oldPoint = {
      label: "R2 Q",
      tooltipKey: "2023-21-186",
      tooltipLabel: "2023 · R2 · Q",
      position: 2,
    };
    const currentPoint = {
      label: "R2 Q",
      tooltipKey: "2024-21-186",
      tooltipLabel: "2024 · R2 · Q",
      position: 32,
    };

    expect(positionChartPointKey(oldPoint)).not.toBe(
      positionChartPointKey(currentPoint),
    );
  });
});
