import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import LivePage from "./live-page";

const fixture = vi.hoisted(() => ({ stages: [] as [string, string[]][] }));

vi.mock("./api/get-live", () => ({
  useLiveRound: () => ({
    data: { roundId: "7", season: 2026 },
    isPending: false,
  }),
  useChronoRaceCatalog: () => ({
    data: fixture.stages.flatMap(([category, names]) =>
      names.map((name) => ({
        id: `${category}-${name}`,
        name,
        sessionType: name,
        category,
        status: "upcoming",
        roundId: "7",
        season: 2026,
        riderCount: 0,
      })),
    ),
    isPending: false,
  }),
  useChronoRaceSessionResults: () => ({ data: undefined }),
}));

it("reverses provider stages across categories without moving junior qualifying above finals", () => {
  fixture.stages = [
    [
      "elite_men",
      ["Timed Training", "Qualification 1", "Qualification 2", "Final"],
    ],
    ["junior_men", ["Timed Training", "Qualification", "Final"]],
  ];
  render(
    <MemoryRouter>
      <LivePage />
    </MemoryRouter>,
  );
  expect(
    screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent),
  ).toEqual([
    "Finals",
    "Qualifying 2",
    "Qualifying 1",
    "Qualifying",
    "Timed Training",
  ]);
});

it("retains every group if categories contain conflicting stage sequences", () => {
  fixture.stages = [
    ["elite_men", ["Stage A", "Stage B"]],
    ["junior_men", ["Stage B", "Stage A"]],
  ];
  render(
    <MemoryRouter>
      <LivePage />
    </MemoryRouter>,
  );
  expect(
    screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent),
  ).toEqual(["Stage A", "Stage B"]);
});

it("orders unfamiliar stages by provider sequence, not session names", () => {
  fixture.stages = [
    ["elite_men", ["Warmup", "Stage Alpha", "Stage Beta", "Decider"]],
    ["junior_men", ["Warmup", "Junior Heat", "Decider"]],
  ];
  render(
    <MemoryRouter>
      <LivePage />
    </MemoryRouter>,
  );
  expect(
    screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent),
  ).toEqual(["Decider", "Stage Beta", "Stage Alpha", "Junior Heat", "Warmup"]);
});
