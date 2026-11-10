import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, it, vi } from "vitest";
import { apiClient } from "../../lib/api-client";
import RoundDetailsPage from "./round-details-page";

vi.mock("../../lib/api-client", () => ({ apiClient: { get: vi.fn() } }));

it.each([true, false])(
  "preserves the selected session when changing category (session available: %s)",
  async (available) => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(apiClient.get).mockImplementation(async (path) => {
      if (path.endsWith("/round-profile"))
        return {
          season: 2026,
          category: "elite_men",
          round: null,
          sessionId: null,
          results: [],
          analytics: null,
          fieldSpread: {
            fieldSize: 0,
            classification: "unavailable",
            p10GapPercent: null,
            points: [],
          },
          trackFingerprint: {
            positionSpread: [],
            mostDecisiveSector: null,
            sectors: [],
          },
        };
      if (path.endsWith("/sessions"))
        return {
          items: ["elite_men", "elite_women"].flatMap((category) =>
            (category === "elite_women" && !available
              ? ["final"]
              : ["final", "qualifying_1"]
            ).map((sessionType) => ({
              sessionId: `${category}-${sessionType}`,
              roundId: "1",
              category,
              sessionType,
              sessionDate: null,
              riderIds: [],
            })),
          ),
          page: 1,
          pageSize: 100,
          totalItems: 4,
          totalPages: 1,
        };
      if (path.endsWith("/results"))
        return {
          session: { completedRidersCount: 0, splitCount: 4, sectorCount: 5 },
          items: [],
          page: 1,
          pageSize: 30,
          totalItems: 0,
          totalPages: 0,
        };
      return {
        id: "1",
        title: "Round",
        season: 2026,
        roundNumber: 1,
        conditionName: null,
        competitionName: "World Cup",
      };
    });
    const view = render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/rounds/1"]}>
          <Routes>
            <Route path="/rounds/:roundId" element={<RoundDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "Qualifying 1" }),
    );
    await user.click(screen.getByRole("button", { name: "Elite Women" }));
    expect(
      within(screen.getByRole("group", { name: "Session" })).getByRole(
        "button",
        { name: "Qualifying 1" },
      ),
    ).toHaveAttribute("aria-pressed", "true");
    await waitFor(() =>
      expect(
        vi
          .mocked(apiClient.get)
          .mock.calls.some(
            ([path, , options]) =>
              path.endsWith("/results") &&
              options?.query?.category === "elite_women" &&
              options.query.sessionType === "qualifying_1",
          ),
      ).toBe(true),
    );
    await user.click(screen.getByRole("button", { name: "Open Women" }));
    await user.click(screen.getByRole("button", { name: "Analytics" }));
    expect(screen.getByRole("button", { name: "Open Women" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Open Men" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        vi
          .mocked(apiClient.get)
          .mock.calls.some(
            ([path, , options]) =>
              path.endsWith("/round-profile") &&
              options?.query?.category === "open_women",
          ),
      ).toBe(true),
    );
    await user.click(screen.getByRole("button", { name: "Results" }));
    expect(screen.getByRole("button", { name: "Open Women" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    view.unmount();
    client.clear();
  },
);
