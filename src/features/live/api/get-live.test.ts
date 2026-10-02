import { describe, expect, it } from "vitest";
import {
  discoverChronoRaceSessions,
  isLiveRoundStatus,
  liveTimingPresentation,
  normalizeChronoRacePayload,
  normalizeTissotLivePayload,
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
  it("omits a zero-length sector caused by a duplicated finish measurement", () => {
    const table = normalizeChronoRacePayload({
      Results: [{ RaceNr: 1, Status: "Finished", RaceTime: 158317,
        Times: [47104, 93241, 158317, 158317].map((RaceTime) => ({ RaceTime })) }],
    }, session);
    expect(table.items.find((item) => !item.isPerfectRun)?.times.map((time) => time.index)).toEqual([1, 2, 3]);
  });
  it.each(["DNF", "DNS", "DSQ"])("does not invent a finishing sector for %s", (status) => {
    const table = normalizeChronoRacePayload({
      Riders: {
        "1": { GivenName: "Joel", FamilyName: "Sutherland" },
        "2": { GivenName: "Ian", FamilyName: "Gil Gonzalez" },
      },
      Results: [
        { RaceNr: 1, Status: status, RaceTime: 78390, Times: [{ RaceTime: 45185 }] },
        { RaceNr: 2, Status: status, RaceTime: 11139, Times: [] },
      ],
    }, session);
    const riders = table.items.filter((item) => !item.isPerfectRun);
    expect(riders[0].times).toHaveLength(1);
    expect(riders[0].times[0].time).toBe(45.185);
    expect(riders[1].times).toHaveLength(0);
    expect(riders.every((item) => item.finalTime === null)).toBe(true);
    expect(table.items.find((item) => item.isPerfectRun)?.times).toHaveLength(1);
  });
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

  it("normalizes the Tissot World Championship format for the live table", () => {
    const normalized = normalizeTissotLivePayload({
      event: { number: 6, name: "Men Junior Downhill" },
      results: [
        {
          resultType: "Time",
          key: "44",
          rider: {
            key: "44",
            bib: 44,
            name: "WILLIAMSON Jonty",
            nation: "NZL",
            uciRiderId: "10169244772",
          },
          splits: [
            { value: "27.674", rank: 1 },
            { value: "1:43.997", rank: 1 },
          ],
          rank: 1,
          value: "3:39.541",
          time: "3:39.541",
          speed: "56.870",
          progression: 0,
          approaching: false,
        },
      ],
    });

    expect(normalized.Riders["10169244772"]).toMatchObject({
      GivenName: "Jonty",
      FamilyName: "Williamson",
      Nation: "NZL",
    });
    expect(normalized.Results[0]).toMatchObject({
      Position: 1,
      RaceTime: 219541,
      Status: "Finished",
      Speed: 56.87,
    });
  });

  it("adds riders from the Tissot start list without duplicating existing results", () => {
    const normalized = normalizeTissotLivePayload({
      results: [{
        rider: { key: "1", name: "BRUNI Loic", nation: "FRA", uciRiderId: "1001" },
        rank: 1,
        time: "3:30.000",
      }],
      startList: {
        results: [
          { rider: { key: "1", name: "BRUNI Loic", nation: "FRA", uciRiderId: "1001" }, rank: 1, value: "11:00:00" },
          { rider: { key: "2", name: "PIERRON Amaury", nation: "FRA", uciRiderId: "1002" }, rank: 2, value: "11:00:30" },
        ],
      },
    });

    expect(normalized.Results).toHaveLength(2);
    expect(normalized.Results[1]).toMatchObject({
      RaceNr: "1002",
      Status: "Upcoming",
      RaceTime: null,
      StartTime: "11:00:30",
    });
    expect(normalized.NextToStart).toHaveLength(1);
  });

  it("does not duplicate Tissot start-list riders during table normalization", () => {
    const tissotPayload = normalizeTissotLivePayload({
      results: [{
        rider: { key: "1", bib: 1, name: "BRUNI Loic", nation: "FRA", uciRiderId: "1001" },
        rank: 1,
        time: "3:30.000",
      }],
      startList: {
        results: [
          { rider: { key: "1", bib: 1, name: "BRUNI Loic", nation: "FRA", uciRiderId: "1001" }, rank: 1, value: "11:00:00" },
          { rider: { key: "2", bib: 22, name: "PIERRON Amaury", nation: "FRA", uciRiderId: "1002" }, rank: 2, value: "11:00:30" },
        ],
      },
    });

    const table = normalizeChronoRacePayload(tissotPayload, session);

    expect(table.items.filter((item) => !item.isPerfectRun)).toHaveLength(2);
    expect(table.items.filter((item) => item.fullName === "Amaury Pierron")).toHaveLength(1);
    expect(table.items.find((item) => item.fullName === "Amaury Pierron")?.startTime).toBe("11:00:30");
  });
});
