import { describe, expect, it } from "vitest";
import { championshipSession } from "./live-championship";
import { normalizeChronoRacePayload, type LiveSession } from "./get-live";

describe("championship timing snapshot", () => {
  it("excludes perfect run and distinguishes finish, live split position and terminal statuses", () => {
    const session = {
      id: "1",
      name: "Final",
      sessionType: "Final",
      category: "elite_men",
      status: "live",
    } as LiveSession;
    const results = normalizeChronoRacePayload(
      {
        Riders: {
          "1": { UciRiderId: "100", GivenName: "A" },
          "2": { UciRiderId: "200", GivenName: "B" },
          "3": { UciRiderId: "300", GivenName: "C" },
        },
        OnTrack: [
          {
            RaceNr: 2,
            SortOrder: 1,
            RaceTime: 30000,
            Times: [{ RaceTime: 20000 }],
          },
        ],
        Results: [
          {
            RaceNr: 1,
            Position: 1,
            RaceTime: 100000,
            Times: [{ RaceTime: 30000 }],
          },
          {
            RaceNr: 2,
            Position: 1,
            RaceTime: 30000,
            Times: [{ RaceTime: 20000 }],
          },
          { RaceNr: 3, Status: "DNS" },
        ],
      },
      session,
    );
    const snapshot = championshipSession(session, { results, status: "live" });
    expect(snapshot.sessionType).toBe("final");
    expect(snapshot.complete).toBe(false);
    expect(snapshot.riders).toHaveLength(3);
    expect(snapshot.riders.find((r) => r.uciId === "100")?.state).toBe(
      "finished",
    );
    expect(snapshot.riders.find((r) => r.uciId === "200")?.state).toBe(
      "pending",
    );
    expect(snapshot.riders.find((r) => r.uciId === "200")?.position).toBeNull();
    expect(snapshot.riders.find((r) => r.uciId === "300")?.state).toBe("dns");
  });
});
