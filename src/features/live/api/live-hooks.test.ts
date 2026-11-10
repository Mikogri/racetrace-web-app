import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  chronoRaceSessionSnapshotOptions,
  liveSessionRawSchema,
} from "./get-live";

const session = liveSessionRawSchema.parse({
  id: "final-em",
  status: "live",
  rounds: { contextName: "20260820_mtb", seasonYear: 2026 },
});

afterEach(() => vi.restoreAllMocks());

describe("live snapshot polling contract", () => {
  it("keeps the ChronoRace URL, cache key, interval and last successful data after a refresh failure", async () => {
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ Results: [] })))
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const options = chronoRaceSessionSnapshotOptions(session);

    expect(options.queryKey).toEqual([
      "live",
      "chronorace",
      "chronorace",
      "results",
      "20260820_mtb-final-em",
    ]);
    expect(options.refetchInterval).toBe(3_000);
    const data = await client.fetchQuery(options);
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      "https://prod.chronorace.be/api/results/generic/uci/20260820_mtb/dh/final-em",
      {
        signal: expect.any(AbortSignal),
        headers: { Accept: "application/json" },
      },
    );
    await expect(client.fetchQuery(options)).rejects.toThrow(
      "Live timing source returned 503.",
    );
    expect(client.getQueryData(options.queryKey)).toBe(data);
    client.clear();
  });

  it("requests only Tissot results and start list, retaining the session status", async () => {
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] })));
    const client = new QueryClient();
    const options = chronoRaceSessionSnapshotOptions({
      ...session,
      provider: "tissot",
      competitionCode: "MTBWCH",
      eventNumber: 6,
      phaseNumber: 2,
    });

    expect(options.queryKey).toEqual([
      "live",
      "chronorace",
      "tissot",
      "results",
      "20260820_mtb-final-em",
    ]);
    expect(options.refetchInterval).toBe(3_000);
    expect((await client.fetchQuery(options)).status).toBe("live");
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      "https://prod.server.tissottiming.com/competitions/mtbwch2026/events/6/phases/2/results",
      "https://prod.server.tissottiming.com/competitions/mtbwch2026/events/6/phases/2/startlist",
    ]);
    client.clear();
  });

  it("does not enable polling without a configured provider session", () => {
    expect(chronoRaceSessionSnapshotOptions(undefined).enabled).toBe(false);
    expect(
      chronoRaceSessionSnapshotOptions({ ...session, contextName: null })
        .enabled,
    ).toBe(false);
    expect(
      chronoRaceSessionSnapshotOptions({
        ...session,
        provider: "tissot",
        contextName: null,
      }).enabled,
    ).toBe(true);
  });
});
