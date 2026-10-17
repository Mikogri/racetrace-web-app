import { describe, expect, it } from "vitest";
import type { CompareData, CompareRider } from "./api/get-compare";
import { pointsSeries, ratingSeries } from "./compare-chart-data";

function chartData(): CompareData {
  const rider: CompareRider = {
    riderId: "7", fullName: "Rider Name", uciId: null, firstName: null, lastName: null,
    countryCode: null, profileImageUrl: null, age: null, currentCategory: null, categories: [],
    teamId: null, teamName: null, teamCode: null, resultsAveragePosition: null, sectorGapSummary: [],
    winsCount: 0, podiumsCount: 0, top5Count: 0, top10Count: 0, rating: null, pace: null,
    consistency: null, confidence: 0, wonSplitsCount: 0, wonSectorsCount: 0,
    averageFinalPosition: null, averagePreFinalPosition: null, averageFinishGapToBestSelected: null,
    finishGapSamplesCount: 0, averageSectorGapsToBestSelected: [], totalPoints: 0,
    roundMetrics: ["10", "2"].map(roundId => ({
      roundId, season: 2025, roundNumber: Number(roundId), date: "2025-01-01", trackId: null,
      trackName: null, venueName: null, competitionClassCode: null, rating: null, pace: null,
      consistency: null, confidence: 0,
    })),
    pointsProgress: ["10", "2"].map(resultId => ({
      resultId, sessionId: resultId, roundId: "2", date: "2025-01-01", sessionType: null,
      category: null, awardedPoints: 1, cumulativePoints: Number(resultId),
    })),
  };
  return { riders: [rider], sessions: [], commonSessions: [], summary: { ridersCount: 1, sessionsCount: 0, commonSessionsCount: 0 } };
}

describe("compare chart preparation", () => {
  it("keeps the last numerically ordered result per round without mutating API data", () => {
    const data = chartData();
    const original = structuredClone(data);
    const series = pointsSeries(data, "/compare");
    expect(series[0].points).toEqual([{
      label: "2025 · R2", tooltipLabel: "2025 · R2 · Unknown venue", position: 10,
      tooltip: "R. Name · 10 pts",
    }]);
    expect(data).toEqual(original);
  });

  it("sorts tied dates by numeric round ID while retaining null ratings", () => {
    const data = chartData();
    const series = ratingSeries(data, "/compare");
    expect(series[0].points.map(point => [point.label, point.position, point.tooltip]))
      .toEqual([["2025 · R2", null, "R. Name · Rating --"], ["2025 · R10", null, "R. Name · Rating --"]]);
    expect(data.riders[0].roundMetrics.map(round => round.roundId)).toEqual(["10", "2"]);
  });
});
