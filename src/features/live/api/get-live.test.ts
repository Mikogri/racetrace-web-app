import { describe, expect, it } from "vitest";
import {
  discoverChronoRaceSessions,
  isLiveRoundStatus,
  liveTimingPresentation,
  normalizeChronoRacePayload,
  resolveChronoRaceJsonUrl,
  resolveChronoRaceSessionStatus,
  type LiveRound,
  type LiveSession,
} from "./get-live";

const session = {
  id: "7",
  name: "Final",
  sessionType: "final",
  category: "elite_men",
  status: "live",
  date: "2026-08-20",
  roundId: "2",
  roundNumber: 4,
  venue: "Pal Arinsal",
  countryCode: "AND",
  season: 2026,
  contextName: "20260820_mtb",
  competitionName: "World Cup",
  riderCount: null,
  chronoraceUrl:
    "https://prod.chronorace.be/api/results/generic/uci/20260820_mtb/dh?key=final-em",
} as LiveSession;

describe("ChronoRace live result normalization", () => {
  it("accepts every active round status emitted by the API", () => {
    expect(isLiveRoundStatus("live")).toBe(true);
    expect(isLiveRoundStatus("ACTIVE")).toBe(true);
    expect(isLiveRoundStatus(" running ")).toBe(true);
    expect(isLiveRoundStatus("scheduled")).toBe(false);
  });

  it("discovers downhill sessions and keys from the ChronoRace CMS catalog", () => {
    const round = {
      roundId: "1",
      roundNumber: 7,
      season: 2026,
      contextName: "20260821_mtb",
      imageUrl: null,
      trackId: "2",
      trackName: "Mont Chery",
      venueId: "2",
      venueName: "Les Gets",
      countryCode: "FRA",
      startDate: "2026-08-21",
      endDate: "2026-08-23",
      status: "live",
      competitionClassId: "2",
      competitionClassCode: "world_cup",
      competitionClassName: "World Cup",
      competitionClassAbbreviation: "WC",
      competitionClassPriority: 2,
    } as LiveRound;
    const sessions = discoverChronoRaceSessions(
      {
        Childs: [
          {
            Name: "DHI",
            Childs: [
              {
                Name: "ME",
                DisplayName: "Men Elite",
                Childs: [
                  {
                    Name: "Qualification 1",
                    Childs: [
                      {
                        Name: "Live Timing",
                        Route:
                          '{"Route":"uci.event.discipline.category.dh","Params":{"key":"2"}}',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      round,
    );

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      id: "2",
      category: "elite_men",
      name: "Qualification 1",
      contextName: "20260821_mtb",
    });
  });

  it("derives live session status directly from ChronoRace timing state", () => {
    expect(resolveChronoRaceSessionStatus(null)).toBe("scheduled");
    expect(resolveChronoRaceSessionStatus({ Riders: {}, Results: [] })).toBe(
      "scheduled",
    );
    expect(
      resolveChronoRaceSessionStatus({
        Riders: {},
        Results: [{}],
        NextToStart: {},
      }),
    ).toBe("live");
    expect(
      resolveChronoRaceSessionStatus({ Riders: {}, Results: [{}] }),
    ).toBe("completed");
    expect(
      resolveChronoRaceSessionStatus({
        Riders: {},
        Results: [{}],
        NextToStart: [],
      }),
    ).toBe("completed");
    expect(
      resolveChronoRaceSessionStatus({
        Riders: {},
        Results: [{}],
        OnTrack: [{ Status: "InRace", RaceTime: 3_300_000, SortOrder: 0 }],
      }),
    ).toBe("completed");
  });

  it("resolves the discipline and key from a public UCI result route", () => {
    expect(
      resolveChronoRaceJsonUrl(
        "https://prod.chronorace.be/angular/results.html#/uci/event/20260619_mtb/DHI/CG1/dh/3/res",
      ),
    ).toBe(
      "https://prod.chronorace.be/api/results/generic/uci/20260619_mtb/dh?key=3",
    );
  });

  it("matches numeric race numbers to riders and derives sector times", () => {
    const result = normalizeChronoRacePayload(
      {
        Riders: {
          "11": {
            RaceNr: 11,
            UciRiderId: 1001,
            GivenName: "LOIC",
            FamilyName: "BRUNI",
            Nation: "FRA",
            UciTeamName: "SPECIALIZED GRAVITY",
          },
        },
        Results: [
          {
            RaceNr: 11,
            Position: 1,
            RaceTime: 126230,
            Status: "Finished",
            Times: [{ RaceTime: 42000 }, { RaceTime: 84000 }],
          },
        ],
      },
      session,
    );

    const rider = result.items.find((item) => !item.isPerfectRun);
    expect(rider?.fullName).toBe("Loic Bruni");
    expect(rider?.teamName).toBe("Specialized Gravity");
    expect(rider?.finalTime).toBeCloseTo(126.23);
    expect(rider?.times).toHaveLength(3);
    expect(rider?.times[0].time).toBeCloseTo(42);
    expect(rider?.times[1].time).toBeCloseTo(42);
    expect(rider?.times[2].time).toBeCloseTo(42.23);
    expect(result.items[0].isPerfectRun).toBe(true);
  });

  it("does not treat an on-track elapsed RaceTime as a finish gap", () => {
    const presentation = liveTimingPresentation({
      Riders: {
        "1": { RaceNr: 1, GivenName: "LEADER", FamilyName: "RIDER" },
        "2": { RaceNr: 2, GivenName: "LIVE", FamilyName: "RIDER" },
      },
      Results: [{
        RaceNr: 1,
        Position: 1,
        RaceTime: 210_000,
        Times: [
          { RaceTime: 50_000, Position: 1 },
          { RaceTime: 100_000, Position: 1 },
        ],
      }],
      OnTrack: [{
        RaceNr: 2,
        Position: 2,
        RaceTime: 211_000,
        ExpectedStartTime: 45_000_000,
        Times: [
          { RaceTime: 49_000, Position: 1 },
          { RaceTime: 101_000, Position: 2 },
        ],
      }],
    });

    const leader = presentation.riders.find((rider) => rider.key === "1");
    const onTrack = presentation.riders.find((rider) => rider.key === "2");
    expect(leader?.isLeader).toBe(true);
    expect(leader?.points.at(-1)).toEqual({ split: 5, gap: 0 });
    expect(onTrack?.points).toEqual([
      { split: 1, gap: -1 },
      { split: 2, gap: 1 },
    ]);
  });
});
