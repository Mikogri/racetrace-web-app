import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRoundDetails } from "./get-round";

afterEach(() => vi.restoreAllMocks());

describe("camelCase round details API", () => {
  it("reads nested public JSON while retaining the existing include alias and request count", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      id: 3, roundNumber: 2, seasonYear: 2026, contextName: "20260820_mtb",
      startDate: "2026-06-10", endDate: "2026-06-12", status: "completed",
      tracks: { name: "Track", venue: "Venue", countryCode: "POL" },
      competitionClass: { name: "World Cup" }, conditions: { name: "Dry" },
    })));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    const hook = renderHook(() => useRoundDetails("3"), { wrapper });
    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data).toEqual({
      id: "3", roundNumber: 2, season: 2026, title: "Venue", trackName: "Track", venueName: "Venue",
      countryCode: "POL", startDate: "2026-06-10", endDate: "2026-06-12", status: "completed",
      competitionName: "World Cup", conditionName: "Dry",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetch.mock.calls[0][0]), window.location.origin);
    expect(url.pathname).toBe("/api/v1/rounds/3");
    expect(url.searchParams.get("include")).toBe("track,categories,conditions,competition_rank");
    hook.unmount();
    client.clear();
  });
});
