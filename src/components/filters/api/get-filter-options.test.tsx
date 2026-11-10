import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { useContextFilterOptions } from "./get-filter-options";
import { filterOptionQueryKeys } from "./filter-option-query-keys";

afterEach(() => vi.unstubAllGlobals());

it("loads all context dictionaries in one request, preserves labels and reuses fresh data", async () => {
  const requests: string[] = [];
  vi.stubGlobal("fetch", async (path: string) => {
    requests.push(path);
    return new Response(
      JSON.stringify({
        seasons: [2026, 2025],
        tracks: [{ id: 7, name: "Track", venue: "Venue", countryCode: "POL" }],
        conditions: [{ id: 2, name: "Wet" }],
        competitionClasses: [{ id: 9, name: "World Cup" }],
      }),
    );
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const first = renderHook(() => useContextFilterOptions(), { wrapper });
  await waitFor(() => expect(first.result.current.isPending).toBe(false));
  expect(first.result.current.isError).toBe(false);
  expect(requests).toHaveLength(1);
  expect(requests[0]).toContain("/api/v1/filter-options");
  expect(first.result.current.options.seasons).toEqual([
    { value: "2026", label: "2026" },
    { value: "2025", label: "2025" },
  ]);
  expect(first.result.current.options.tracks).toEqual([
    { value: "7", label: "Track", subtitle: "Venue, POL" },
  ]);
  expect(first.result.current.options.conditions).toEqual([
    { value: "2", label: "Wet" },
  ]);
  expect(first.result.current.options.classes).toEqual([
    { value: "9", label: "World Cup" },
  ]);
  expect(first.result.current.options.categories.length).toBeGreaterThan(0);
  first.unmount();
  const second = renderHook(() => useContextFilterOptions(), { wrapper });
  await waitFor(() => expect(second.result.current.isPending).toBe(false));
  expect(requests).toHaveLength(1);
  second.unmount();
  client.clear();
});

it("refreshes the context bundle after five minutes on mount", async () => {
  const requests: string[] = [];
  vi.stubGlobal("fetch", async (path: string) => {
    requests.push(path);
    return new Response(
      JSON.stringify({
        seasons: [2026],
        tracks: [],
        conditions: [],
        competitionClasses: [],
      }),
    );
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(
    filterOptionQueryKeys.context(),
    { seasons: [2025], tracks: [], conditions: [], competitionClasses: [] },
    { updatedAt: Date.now() - 300_001 },
  );
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const hook = renderHook(() => useContextFilterOptions(), { wrapper });
  await waitFor(() =>
    expect(hook.result.current.options.seasons).toEqual([
      { value: "2026", label: "2026" },
    ]),
  );
  expect(requests).toHaveLength(1);
  hook.unmount();
  client.clear();
});
