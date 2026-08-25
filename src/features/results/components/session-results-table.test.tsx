import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { SessionResults } from "../../live/api/get-live";
import { SessionResultsTable } from "./session-results-table";
import styles from "./session-results-table.module.css";

const data: SessionResults = {
  session: {
    sessionId: "session-1",
    roundId: "round-1",
    sessionType: "final",
    category: "elite_men",
    condition: null,
    completedRidersCount: 0,
    startedRidersCount: 2,
    splitCount: 1,
    sectorCount: 1,
    timeView: "splits",
  },
  items: [
    {
      position: 1,
      resultId: "result-fastest",
      riderId: "rider-fastest",
      uciId: null,
      firstName: "Fastest",
      lastName: "Rider",
      fullName: "Fastest Rider",
      countryCode: "FRA",
      teamId: null,
      teamName: null,
      status: "finished",
      topSpeed: 77.4,
      averageSpeed: null,
      finalTime: 101.25,
      finalGapToBest: 0,
      awardedPoints: 0,
      times: [
        { index: 1, name: "Split 1", time: 51.1, gapToBest: 0, position: 1 },
      ],
      isPerfectRun: false,
    },
    {
      position: 31,
      resultId: "result-dnf",
      riderId: "rider-dnf",
      uciId: null,
      firstName: "Partial",
      lastName: "Run",
      fullName: "Partial Run",
      countryCode: "POL",
      teamId: null,
      teamName: null,
      status: "dnf",
      topSpeed: null,
      averageSpeed: null,
      finalTime: 107.411,
      finalGapToBest: 42.5,
      awardedPoints: 0,
      times: [
        { index: 1, name: "Split 1", time: 53.2, gapToBest: 2.1, position: 31 },
      ],
      isPerfectRun: false,
    },
    {
      position: 32,
      resultId: "result-dns",
      riderId: "rider-dns",
      uciId: null,
      firstName: "No",
      lastName: "Start",
      fullName: "No Start",
      countryCode: "POL",
      teamId: null,
      teamName: null,
      status: "dns",
      topSpeed: null,
      averageSpeed: null,
      finalTime: 0,
      finalGapToBest: null,
      awardedPoints: 0,
      times: [],
      isPerfectRun: false,
    },
    {
      position: null,
      resultId: null,
      riderId: null,
      uciId: null,
      firstName: null,
      lastName: null,
      fullName: "Perfect Run",
      countryCode: null,
      teamId: null,
      teamName: null,
      status: "perfect_run",
      topSpeed: null,
      averageSpeed: null,
      finalTime: 100,
      finalGapToBest: -1.25,
      awardedPoints: 0,
      times: [
        { index: 1, name: "Split 1", time: 50, gapToBest: -0.25, position: 1 },
      ],
      isPerfectRun: true,
    },
  ],
  page: 2,
  pageSize: 30,
  totalItems: 32,
  totalPages: 2,
};

describe("SessionResultsTable", () => {
  it("never marks a sector with a positive gap as green", () => {
    const inconsistentSectorRank: SessionResults = {
      ...data,
      items: data.items.map((item) =>
        item.resultId === "result-dnf"
          ? {
              ...item,
              times: item.times.map((time) => ({
                ...time,
                position: 1,
              })),
            }
          : item,
      ),
    };

    render(
      <MemoryRouter>
        <SessionResultsTable
          data={inconsistentSectorRank}
          category="elite_men"
          sortBy="time:1"
          sortDirection="desc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    );

    const slowerRow = screen.getByRole("row", { name: /Partial Run/ });
    expect(within(slowerRow).getByText("+2.100")).toHaveClass(
      styles.sectorSlower,
    );
  });

  it("shows the session leader's zero gap in green even when it is not the fastest sector", () => {
    const leaderWithoutBestSector: SessionResults = {
      ...data,
      items: data.items.map((item) =>
        item.resultId === "result-fastest"
          ? {
              ...item,
              times: item.times.map((time) => ({
                ...time,
                gapToBest: 0.5,
                position: 2,
              })),
            }
          : item.resultId === "result-dnf"
            ? {
                ...item,
                times: item.times.map((time) => ({
                  ...time,
                  time: 50.5,
                  gapToBest: 0,
                  position: 1,
                })),
              }
            : item,
      ),
    };

    render(
      <MemoryRouter>
        <SessionResultsTable
          data={leaderWithoutBestSector}
          category="elite_men"
          sortBy="time:1"
          sortDirection="desc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    );

    const leaderRow = screen.getByRole("row", { name: /Fastest Rider/ });
    expect(within(leaderRow).getByText("51.100")).toHaveClass(
      styles.sectorBest,
    );
  });

  it("formats a zero sector gap as a negative zero", () => {
    const equalSectorData: SessionResults = {
      ...data,
      items: data.items.map((item) =>
        item.resultId === "result-dnf"
          ? {
              ...item,
              times: item.times.map((time) => ({
                ...time,
                time: 51.1,
                gapToBest: 0,
                position: 31,
              })),
            }
          : item,
      ),
    };

    render(
      <MemoryRouter>
        <SessionResultsTable
          data={equalSectorData}
          category="elite_men"
          sortBy="time:1"
          sortDirection="desc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    );

    const riderRow = screen.getByRole("row", { name: /Partial Run/ });
    expect(within(riderRow).getByText("−0.000")).toHaveClass(
      styles.sectorBest,
    );
  });

  it("uses two decimals for minute-long split times and three below a minute", () => {
    const minuteData: SessionResults = {
      ...data,
      items: data.items.map((item) =>
        item.resultId === "result-fastest"
          ? {
              ...item,
              times: [
                {
                  index: 1,
                  name: "Split 1",
                  time: 67.392,
                  gapToBest: 0,
                  position: 1,
                },
              ],
            }
          : item,
      ),
    };

    render(
      <MemoryRouter>
        <SessionResultsTable
          data={minuteData}
          category="elite_men"
          sortBy="time:1"
          sortDirection="desc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("1:07.39")).toBeInTheDocument();
    expect(screen.getByText("−17.39")).toBeInTheDocument();
    expect(screen.getByText("−17.39")).toHaveClass(styles.sectorBest);
  });

  it("sorts descending sector rankings with the fastest rider first", () => {
    render(
      <MemoryRouter>
        <SessionResultsTable
          data={data}
          category="elite_men"
          sortBy="time:1"
          sortDirection="desc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    );

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows[0]).toHaveAccessibleName(/Perfect Run/);
    expect(rows[1]).toHaveAccessibleName(/Fastest Rider/);
    expect(rows[2]).toHaveAccessibleName(/Partial Run/);
  });

  it("marks the session winner from the final gap rather than the current table position", () => {
    const sectorSortedData: SessionResults = {
      ...data,
      items: data.items.map((item) =>
        item.resultId === "result-fastest"
          ? { ...item, position: 8 }
          : item.resultId === "result-dnf"
            ? { ...item, position: 1 }
            : item,
      ),
    };

    render(
      <MemoryRouter>
        <SessionResultsTable
          data={sectorSortedData}
          category="elite_men"
          sortBy="time:1"
          sortDirection="desc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    );

    const winnerRow = screen.getByRole("row", { name: /Fastest Rider/ });
    const firstPositionRow = screen.getByRole("row", { name: /Partial Run/ });
    expect(within(winnerRow).getAllByText("Winner")).toHaveLength(1);
    expect(within(winnerRow).getByText("51.100")).toBeInTheDocument();
    expect(
      within(firstPositionRow).queryByText("Winner"),
    ).not.toBeInTheDocument();
  });

  it("shows partial splits while replacing only the run time with DNS/DNF statuses", () => {
    render(
      <MemoryRouter>
        <SessionResultsTable
          data={data}
          category="elite_men"
          sortBy="finalTime"
          sortDirection="asc"
          onSort={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("columnheader", { name: "S1" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Status" }),
    ).not.toBeInTheDocument();

    const perfectRow = screen.getByRole("row", { name: /Perfect Run/ });
    expect(screen.getAllByRole("row").slice(1)[0]).toBe(perfectRow);
    expect(within(perfectRow).queryByRole("link")).not.toBeInTheDocument();
    expect(within(perfectRow).getByLabelText("Perfect Run")).toHaveTextContent(
      "★",
    );
    expect(within(perfectRow).getByText("−1.100")).toBeInTheDocument();
    expect(perfectRow).toHaveClass(styles.perfectRunRow);

    const fastestRow = screen.getByRole("row", { name: /Fastest Rider/ });
    expect(within(fastestRow).getByText("51.100")).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Top speed" }),
    ).not.toBeInTheDocument();

    const dnfRow = screen.getByRole("row", { name: /Partial Run/ });
    const dnsRow = screen.getByRole("row", { name: /No Start/ });
    expect(within(dnfRow).getByText("DNF")).toBeInTheDocument();
    expect(within(dnfRow).queryByText("53.20")).not.toBeInTheDocument();
    expect(within(dnfRow).getByText("+2.100")).toBeInTheDocument();
    expect(within(dnfRow).queryByText("1:47.41")).not.toBeInTheDocument();
    expect(within(dnsRow).getByText("DNS")).toBeInTheDocument();
    expect(within(dnsRow).queryByText("0:00.000")).not.toBeInTheDocument();
  });
});
