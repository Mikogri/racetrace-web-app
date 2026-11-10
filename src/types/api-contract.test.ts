import { describe, expect, it } from "vitest";
import { riderTeamHistorySchema } from "../features/riders/api/team-history-schema";
import { fantasyRiderSchema } from "../features/fantasy/api/get-fantasy";

describe("OpenAPI-compatible runtime validation", () => {
  it("accepts backend nullable team names and still normalizes numeric IDs", () => {
    const [row] = riderTeamHistorySchema.parse([
      {
        id: 1,
        riderId: 2,
        teamId: 3,
        teamName: null,
        teamCode: null,
        validFrom: "2026-01-01",
        validTo: null,
        isCurrent: true,
        sourceRoundId: null,
      },
    ]);
    expect(row?.teamName).toBeNull();
    expect(row?.riderId).toBe("2");
  });

  it("retains runtime rejection of malformed nullable numbers and unknown enum values", () => {
    const rider = {
      pinkbikeExternalId: "1",
      riderId: null,
      name: "Rider",
      countryCode: null,
      gender: "male",
      price: null,
      pinkbikeSeasonPoints: null,
      entryStatus: "unknown",
      expectedFinalPoints: null,
      expectedQ1Bonus: null,
      expectedFantasyPoints: null,
      predictedPosition: null,
      confidence: null,
      isRecommended: false,
      warnings: [],
    };
    expect(fantasyRiderSchema.safeParse(rider).success).toBe(true);
    expect(
      fantasyRiderSchema.safeParse({ ...rider, price: "invalid" }).success,
    ).toBe(false);
    expect(
      fantasyRiderSchema.safeParse({ ...rider, gender: "invalid" }).success,
    ).toBe(false);
  });
});
