import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../../lib/api-client";
import { useContextFilterOptions } from "../../components/filters/api/get-filter-options";
import { useSeasons } from "../../components/filters/api/get-seasons";
import { filterOptionQueryKeys } from "../../components/filters/api/filter-option-query-keys";
import ResultsPage from "./results-page";

vi.mock("../../lib/api-client", () => ({ apiClient: { get: vi.fn() } }));

afterEach(() => vi.clearAllMocks());

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  vi.mocked(apiClient.get).mockImplementation(async (path) => {
    if (path === "/api/v1/rounds/seasons") return { items: [2026, 2025] };
    if (path === "/api/v1/filter-options")
      return {
        seasons: [2026, 2025],
        tracks: [],
        conditions: [],
        competitionClasses: [],
      };
    if (path === "/api/v1/rounds")
      return {
        items: [],
        page: 1,
        pageSize: 100,
        totalItems: 0,
        totalPages: 0,
      };
    return [];
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return { client, wrapper };
}

describe("filter request budget", () => {
  it("Results loads only rounds and seasons and keeps its empty state", async () => {
    const { client, wrapper } = setup();
    render(<ResultsPage />, { wrapper });
    await screen.findByText("No data available");
    expect(
      vi
        .mocked(apiClient.get)
        .mock.calls.map(([path]) => path)
        .sort(),
    ).toEqual(["/api/v1/rounds", "/api/v1/rounds/seasons"]);
    expect(screen.getByRole("button", { name: "2026" })).toBeInTheDocument();
    client.clear();
  });

  it("keeps Results seasons independent and reuses the fresh context bundle on remount", async () => {
    const { client, wrapper } = setup();
    const first = renderHook(
      () => ({ seasons: useSeasons(), filters: useContextFilterOptions() }),
      { wrapper },
    );
    await waitFor(() =>
      expect(first.result.current.filters.isPending).toBe(false),
    );
    expect(apiClient.get).toHaveBeenCalledTimes(2);
    first.unmount();
    const second = renderHook(() => useContextFilterOptions(), { wrapper });
    await waitFor(() => expect(second.result.current.isPending).toBe(false));
    expect(apiClient.get).toHaveBeenCalledTimes(2);
    second.unmount();
    client.clear();
  });

  it("refreshes stale seasons after five minutes when mounted", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(
      filterOptionQueryKeys.seasons(),
      { items: [2025] },
      { updatedAt: Date.now() - 300_001 },
    );
    const hook = renderHook(() => useSeasons(), { wrapper });
    await waitFor(() =>
      expect(hook.result.current.data?.items).toEqual([2026, 2025]),
    );
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    hook.unmount();
    client.clear();
  });
});
