import { describe, expect, it } from "vitest";
import { parseServerTiming } from "./api-response-meta";

describe("ranking request timings", () => {
  it("reads named server phases in milliseconds without treating cache hits as calculations", () => {
    expect(
      parseServerTiming(
        'sessions;dur=23.5, packages;dur=712, metrics;dur=482.25, cache;desc="Output cache hit"',
      ),
    ).toEqual({ sessions: 23.5, packages: 712, metrics: 482.25, cache: 0 });
  });

  it("ignores malformed or unknown timings", () => {
    expect(
      parseServerTiming("packages;dur=oops, custom;dur=4, rows;dur=-2"),
    ).toEqual({});
  });

  it("retains upstream transport time separately from overlapping ranking phases", () => {
    expect(
      parseServerTiming(
        "packages;dur=700, supabase_headers;dur=330, supabase_io;dur=420, api;dur=900",
      ),
    ).toEqual({
      packages: 700,
      supabase_headers: 330,
      supabase_io: 420,
      api: 900,
    });
  });
});
