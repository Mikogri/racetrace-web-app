import { describe, expect, it } from "vitest";
import { metricsApiQuery, serializeFilterValues } from "./metrics-api-query";

describe("metric request serialization", () => {
  it("keeps the existing aliases, ordering and single category selection", () => {
    expect(
      metricsApiQuery({
        seasons: ["2026", "2023"],
        tracks: ["7", "2"],
        conditions: ["1"],
        classes: ["4"],
        categories: ["elite_women", "elite_men"],
      }),
    ).toEqual({
      season: "2026,2023",
      trackId: "7,2",
      conditionId: "1",
      competitionClassId: "4",
      category: "elite_women",
    });
  });

  it("does not introduce category or season defaults for empty filters", () => {
    expect(
      metricsApiQuery({
        seasons: [],
        tracks: [],
        conditions: [],
        classes: [],
        categories: [],
      }),
    ).toEqual({
      season: undefined,
      trackId: undefined,
      conditionId: undefined,
      competitionClassId: undefined,
      category: undefined,
    });
  });

  it("preserves values instead of silently normalizing them", () => {
    expect(serializeFilterValues(["2", "1", "2"])).toBe("2,1,2");
    expect(serializeFilterValues([])).toBeUndefined();
  });
});
