import { describe, expect, it } from "vitest";
import { liveQueryKeys } from "../features/live/api/live-query-keys";
import { rankingQueryKeys } from "../features/ranking/api/ranking-query-keys";
import { riderQueryKeys } from "../features/riders/api/rider-query-keys";
import { roundQueryKeys } from "../features/rounds/api/round-query-keys";

describe("query key factories", () => {
  it("nests list and detail keys under stable roots", () => {
    expect(rankingQueryKeys.list({ season: 2026 })).toEqual([
      "ranking",
      "list",
      { season: 2026 },
    ]);
    expect(riderQueryKeys.detail("42")).toEqual(["riders", "detail", "42"]);
    expect(roundQueryKeys.sessions("8")).toEqual([
      "rounds",
      "detail",
      "8",
      "sessions",
    ]);
    expect(liveQueryKeys.chronoResults("20260821_mtb", "12")).toEqual([
      "live",
      "chronorace",
      "20260821_mtb",
      "results",
      "12",
    ]);
  });
});
