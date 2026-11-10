import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { roundRaceAnalyticsSchema } from "../api/round-race-analytics-schema";
import { RoundRaceSections } from "./round-race-sections";

const emptyAnalytics = () =>
  roundRaceAnalyticsSchema.parse({
    methodVersion: "round-analytics-v1",
    sectorEfficiency: [],
    chaos: {
      score: null,
      starters: 0,
      dnfCount: 0,
      incidentCount: 0,
      components: [],
    },
    correlation: { preFinalSession: null, spearman: null, points: [] },
    winningMargin: null,
    runEfficiency: null,
    distribution: {
      ridersCount: 0,
      classifiedCount: 0,
      median: null,
      bins: [],
      outliers: [],
    },
  });

describe("Round analytics sections", () => {
  it("keeps the histogram without rendering individual outlier names and scores", () => {
    const data = emptyAnalytics();
    data.distribution = {
      ridersCount: 30,
      classifiedCount: 30,
      median: 80,
      bins: [{ from: 0, to: 10, count: 1 }],
      outliers: [{ riderId: "1", fullName: "Finn ILES", pace: 3.1 }],
    };
    render(<RoundRaceSections data={data} loading={false} />);
    expect(screen.getByText("30 / 30 riders measured")).toBeInTheDocument();
    expect(screen.queryByText(/Finn Iles/i)).not.toBeInTheDocument();
    expect(screen.queryByText("3.1")).not.toBeInTheDocument();
  });

  it("keeps all six section headers while loading without fabricating scores", () => {
    render(<RoundRaceSections data={null} loading />);
    expect(screen.getAllByRole("heading")).toHaveLength(6);
    expect(screen.getAllByRole("status")).toHaveLength(6);
    expect(screen.queryByText(/Upset/)).not.toBeInTheDocument();
    expect(screen.queryByText("0 / 100")).not.toBeInTheDocument();
  });

  it("explains missing evidence instead of displaying zero metrics", () => {
    render(<RoundRaceSections data={emptyAnalytics()} loading={false} />);
    expect(screen.getAllByText("No data available")).toHaveLength(6);
    expect(
      screen.getByText(/At least 3 paired classified riders/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Complete sector times for the winner and P2/),
    ).toBeInTheDocument();
  });

  it("shows winner efficiency separately from sector wins", () => {
    const data = emptyAnalytics();
    data.runEfficiency = {
      riderId: "1",
      fullName: "Rider One",
      sectorsCount: 5,
      measuredSectors: 4,
      sectorsWon: 1,
      sectorsTop3: 3,
      sectorsWonPercent: 25,
      sectorsTop3Percent: 75,
      averageSectorPosition: 2.25,
      sectorsFor80PercentGain: null,
    };
    render(<RoundRaceSections data={data} loading={false} />);
    expect(screen.getByText("Rider One")).toBeInTheDocument();
    expect(screen.getByText("4 / 5 sectors measured")).toBeInTheDocument();
    expect(screen.getByText("2.25")).toBeInTheDocument();
    expect(screen.getByText("Sectors for 80% of gains")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Sectors won" }),
    ).toHaveAttribute("aria-valuenow", "25");
    expect(
      screen.getByRole("progressbar", { name: "Sectors Top 3" }),
    ).toHaveAttribute("aria-valuenow", "75");
  });
});
