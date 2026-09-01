type IdentifiableChartPoint = {
  label: string;
  tooltipKey?: string;
  tooltipLabel?: string;
};

export function positionChartPointKey(point: IdentifiableChartPoint) {
  return point.tooltipKey ?? point.tooltipLabel ?? point.label;
}

export function metricAxisConfiguration(values: number[]) {
  const finiteValues = values.filter(Number.isFinite).map((value) =>
    Math.min(100, Math.max(0, value)),
  );
  if (finiteValues.length === 0) {
    return {
      domain: [0, 100] as [number, number],
      ticks: [0, 25, 50, 75, 100],
    };
  }

  const minimumValue = Math.min(...finiteValues);
  const maximumValue = Math.max(...finiteValues);
  let minimum = Math.max(0, Math.floor((minimumValue - 10) / 10) * 10);
  let maximum = Math.min(100, Math.ceil((maximumValue + 10) / 10) * 10);

  if (maximum - minimum < 20) {
    minimum = Math.max(0, minimum - 10);
    maximum = Math.min(100, maximum + 10);
  }

  const ticks = Array.from({ length: 5 }, (_, index) =>
    Math.round((minimum + ((maximum - minimum) * index) / 4) * 10) / 10,
  );
  return { domain: [minimum, maximum] as [number, number], ticks };
}
