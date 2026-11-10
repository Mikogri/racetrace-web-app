import { describe, expect, it } from "vitest";
import { liveRoundContextSchema, liveSessionRawSchema } from "./live-models";

describe("camelCase live API models", () => {
  it("reads dynamic round context without altering underscore-valued identifiers", () => {
    expect(
      liveRoundContextSchema.parse({ contextName: "20260820_mtb" }),
    ).toEqual({ contextName: "20260820_mtb" });
  });

  it("normalizes nested first-party session JSON into the existing UI model", () => {
    expect(
      liveSessionRawSchema.parse({
        id: 12,
        roundId: 3,
        sessionType: "qualifying_1",
        sessionDate: "2026-06-10",
        chronoraceUrl: "https://example.com/timing",
        categories: { code: "elite_men" },
        rounds: {
          id: 3,
          roundNumber: 2,
          seasonYear: 2026,
          contextName: "20260820_mtb",
          competitionLevels: { name: "World Cup" },
          tracks: { venue: "Venue", countryCode: "POL" },
        },
      }),
    ).toMatchObject({
      id: "12",
      roundId: "3",
      name: "qualifying_1",
      sessionType: "qualifying_1",
      date: "2026-06-10",
      category: "elite_men",
      roundNumber: 2,
      season: 2026,
      contextName: "20260820_mtb",
      competitionName: "World Cup",
      venue: "Venue",
      countryCode: "POL",
      chronoraceUrl: "https://example.com/timing",
    });
  });
});
