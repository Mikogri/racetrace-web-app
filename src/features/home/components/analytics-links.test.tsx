import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { homeRoundSchema, type RoundProfile } from "../api/get-home-data";
import {
  FieldSpreadSection,
  SpeedVsRunTimeSection,
  TrackFingerprintSection,
} from "../../../components/analytics/analytics-sections";

it.each([FieldSpreadSection, TrackFingerprintSection])(
  "opens Analytics from the Home analysis link",
  (Section) => {
    const profile: RoundProfile = {
      season: 2026,
      category: "elite_men",
      sessionId: null,
      results: [],
      analytics: null,
      round: homeRoundSchema.parse({
        roundId: "37",
        season: 2026,
        status: "completed",
      }),
      fieldSpread: {
        fieldSize: 0,
        classification: "unavailable",
        p10GapPercent: null,
        points: [],
      },
      trackFingerprint: {
        mostDecisiveSector: null,
        sectors: [],
        positionSpread: [],
      },
    };
    render(
      <MemoryRouter>
        <Section
          profile={profile}
          loading={false}
          error={false}
          category="elite_men"
          onCategoryChange={() => {}}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: /Explore Round Analysis/ }),
    ).toHaveAttribute("href", "/results/rounds/37?tab=analyze");
  },
);

it.each([
  [FieldSpreadSection, "Loading Field Spread"],
  [TrackFingerprintSection, "Loading Track Fingerprint"],
] as const)(
  "preserves the shared loading state in embedded Analytics",
  (Section, label) => {
    render(
      <MemoryRouter>
        <Section
          loading
          error={false}
          category="elite_men"
          onCategoryChange={() => {}}
          embedded
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("status", { name: label })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Result category" }),
    ).not.toBeInTheDocument();
  },
);

it.each([FieldSpreadSection, TrackFingerprintSection])(
  "preserves the shared error state in embedded Analytics",
  (Section) => {
    render(
      <MemoryRouter>
        <Section
          loading={false}
          error
          category="elite_men"
          onCategoryChange={() => {}}
          embedded
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  },
);

it("preserves the speed chart loading state without Home controls when embedded", () => {
  render(
    <MemoryRouter>
      <SpeedVsRunTimeSection
        results={[]}
        loading
        updating={false}
        category="elite_men"
        onCategoryChange={() => {}}
        embedded
      />
    </MemoryRouter>,
  );
  expect(
    screen.getByLabelText("Loading final performance chart"),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("group", { name: "Result category" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
