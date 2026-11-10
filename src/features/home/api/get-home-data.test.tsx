import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useHomeRanking } from "./get-home-data";

const ranking = (riderId: number) => ({
  items: [
    {
      position: 1,
      riderId,
      fullName: `Rider ${riderId}`,
      totalPoints: 100,
      rating: 90,
      pace: null,
      consistency: null,
      confidence: 0.8,
      finalsCount: 2,
      qualifyingRate: 1,
    },
  ],
  page: 1,
  pageSize: 5,
  totalItems: 1,
  totalPages: 1,
  summary: { sessionsCount: 2, finalsCount: 2, ridersCount: 1 },
});
const bundle = (id = 1) => ({
  topRated: ranking(id),
  standings: ranking(id + 1),
});

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("Home rankings", () => {
  it("shares one response for the same season/category with independent list projections", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(bundle())));
    vi.stubGlobal("fetch", fetcher);
    const { result } = renderHook(
      () => ({
        rated: useHomeRanking(2026, "elite_men", "rating"),
        standings: useHomeRanking(2026, "elite_men", "totalPoints"),
      }),
      { wrapper: wrapper() },
    );
    await waitFor(() =>
      expect(
        result.current.rated.isSuccess && result.current.standings.isSuccess,
      ).toBe(true),
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(fetcher.mock.calls[0]![0])).toContain(
      "/api/v1/home/ranking?season=2026&category=elite_men",
    );
    expect(result.current.rated.data?.items[0]?.riderId).toBe("1");
    expect(result.current.standings.data?.items[0]?.riderId).toBe("2");
  });

  it("keeps the other category available while one control changes and fails", async () => {
    let rejectRequest: (error: Error) => void = () => {};
    const fetcher = vi.fn().mockImplementation((url: string) =>
      url.includes("elite_women")
        ? new Promise<Response>((_resolve, reject) => {
            rejectRequest = reject;
          })
        : Promise.resolve(new Response(JSON.stringify(bundle()))),
    );
    vi.stubGlobal("fetch", fetcher);
    const { result, rerender } = renderHook(
      ({ category }) => ({
        rated: useHomeRanking(2026, category, "rating"),
        standings: useHomeRanking(2026, "elite_men", "totalPoints"),
      }),
      { wrapper: wrapper(), initialProps: { category: "elite_men" } },
    );
    await waitFor(() => expect(result.current.rated.isSuccess).toBe(true));
    rerender({ category: "elite_women" });
    expect(result.current.rated.isFetching).toBe(true);
    expect(result.current.standings.isSuccess).toBe(true);
    expect(result.current.standings.data?.items[0]?.riderId).toBe("2");
    await act(async () => rejectRequest(new Error("Network failed")));
    await waitFor(() => expect(result.current.rated.isError).toBe(true));
    expect(result.current.standings.isError).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("does not share responses across seasons", async () => {
    const fetcher = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify(bundle()))),
      );
    vi.stubGlobal("fetch", fetcher);
    const { result } = renderHook(
      () => ({
        rated: useHomeRanking(2025, "elite_men", "rating"),
        standings: useHomeRanking(2026, "elite_men", "totalPoints"),
      }),
      { wrapper: wrapper() },
    );
    await waitFor(() =>
      expect(
        result.current.rated.isSuccess && result.current.standings.isSuccess,
      ).toBe(true),
    );
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
