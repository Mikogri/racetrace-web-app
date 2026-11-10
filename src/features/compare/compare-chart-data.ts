import type { CompareData, CompareRider } from "./api/get-compare";
import type {
  PositionChartPoint,
  PositionChartSeries,
} from "../../components/charts/position-chart";
import { formatSessionLabel } from "../../utils/domain-metadata";
import { normalizeDisplayName } from "../../utils/display-name";
import { riderPathForLocation } from "../../components/navigation/rider-navigation-state";
import { formatOneDecimal } from "../../utils/formatters";
import { abbreviateRiderName } from "../../utils/rider-name";

export const riderColors = [
  "var(--color-compare-rider-a-accent)",
  "var(--color-compare-rider-b-accent)",
];

export const riderName = (rider: CompareRider) =>
  normalizeDisplayName(rider.fullName);
export const shortRiderName = (rider: CompareRider) => {
  return abbreviateRiderName(riderName(rider).trim());
};

export function comparisonResultsSeries(
  data: CompareData,
  pathname: string,
): PositionChartSeries[] {
  const sessions = [...data.commonSessions].sort(
    (left, right) =>
      (left.sessionDate ?? "").localeCompare(right.sessionDate ?? "") ||
      Number(left.sessionId) - Number(right.sessionId),
  );
  return data.riders.map((rider, riderIndex) => ({
    id: rider.riderId,
    name: riderName(rider),
    color: riderColors[riderIndex],
    href: riderPathForLocation(pathname, rider.riderId),
    averagePosition: rider.resultsAveragePosition,
    points: sessions.map((session) => {
      const result = session.results.find(
        (item) => item.riderId === rider.riderId,
      );
      const sessionLabel = session.sessionType?.toLowerCase().includes("final")
        ? "FIN"
        : session.sessionType
          ? formatSessionLabel(session.sessionType).toUpperCase()
          : "SESSION";
      return {
        label: `${session.season ?? "----"} · ${session.roundNumber ? `R${session.roundNumber}` : "R--"}`,
        tooltipLabel: `${session.season ?? "----"} · ${session.roundNumber ? `R${session.roundNumber}` : "R--"} · ${session.venueName ?? session.trackName ?? "Unknown venue"} · ${sessionLabel}`,
        position: result?.isClassified ? result.position : null,
        status: result?.status ?? null,
        tooltip: `${shortRiderName(rider)} · ${result?.position ? `P${result.position}` : (result?.status ?? "not classified")}`,
      };
    }),
  }));
}

export function pointsSeries(
  data: CompareData,
  pathname: string,
): PositionChartSeries[] {
  return data.riders.map((rider, riderIndex) => {
    const roundById = new Map(
      rider.roundMetrics.map((round) => [round.roundId, round]),
    );
    const ordered = [...rider.pointsProgress].sort(
      (left, right) =>
        (left.date ?? "").localeCompare(right.date ?? "") ||
        Number(left.resultId) - Number(right.resultId),
    );
    const lastByRound = new Map<string, (typeof ordered)[number]>();
    ordered.forEach((point) => lastByRound.set(point.roundId, point));
    const points: PositionChartPoint[] = [...lastByRound.values()].map(
      (point) => {
        const round = roundById.get(point.roundId);
        return {
          label: `${round?.season ?? "----"} · ${round?.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
          tooltipLabel: `${round?.season ?? "----"} · ${round?.roundNumber == null ? "R--" : `R${round.roundNumber}`} · ${round?.venueName ?? round?.trackName ?? "Unknown venue"}`,
          position: point.cumulativePoints,
          tooltip: `${shortRiderName(rider)} · ${Math.round(point.cumulativePoints)} pts`,
        };
      },
    );
    return {
      id: rider.riderId,
      name: riderName(rider),
      color: riderColors[riderIndex],
      href: riderPathForLocation(pathname, rider.riderId),
      points,
    };
  });
}

export function ratingSeries(
  data: CompareData,
  pathname: string,
): PositionChartSeries[] {
  return data.riders.map((rider, riderIndex) => ({
    id: rider.riderId,
    name: riderName(rider),
    color: riderColors[riderIndex],
    href: riderPathForLocation(pathname, rider.riderId),
    points: [...rider.roundMetrics]
      .sort(
        (left, right) =>
          (left.date ?? "").localeCompare(right.date ?? "") ||
          Number(left.roundId) - Number(right.roundId),
      )
      .map((round) => ({
        label: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`}`,
        tooltipLabel: `${round.season ?? "----"} · ${round.roundNumber == null ? "R--" : `R${round.roundNumber}`} · ${round.venueName ?? round.trackName ?? "Unknown venue"}`,
        position: round.rating,
        tooltip: `${shortRiderName(rider)} · Rating ${round.rating == null ? "--" : formatOneDecimal(round.rating)}`,
      })),
  }));
}
