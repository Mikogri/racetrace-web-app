import { render, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LegacyRiderVenuesRedirect, LegacyRoundDetailsRedirect, LegacySessionResultsRedirect } from "./legacy-route-redirects";

describe("legacy route redirects", () => {
  it.each([
    { path: "/rounds/:roundId", from: "/rounds/42?season=2025#details", to: "/results/rounds/42", element: <LegacyRoundDetailsRedirect /> },
    { path: "/sessions/:sessionId/results", from: "/sessions/a%20b/results?context=live", to: "/live/results/a%20b", element: <LegacySessionResultsRedirect /> },
    { path: "/riders/:riderId/venues", from: "/riders/24/venues?season=2025", to: "/riders/24/tracks", element: <LegacyRiderVenuesRedirect /> },
    { path: "/ranking/riders/:riderId/venues", from: "/ranking/riders/24/venues", to: "/riders/24/tracks", element: <LegacyRiderVenuesRedirect /> },
  ])("replaces $from with $to, retaining existing query/hash discard behavior", async ({ path, from, to, element }) => {
    const router = createMemoryRouter([
      { path, element },
      { path: "*", element: <div>Destination</div> },
    ], { initialEntries: ["/previous", from], initialIndex: 1 });
    render(<RouterProvider router={router} />);
    await waitFor(() => expect(router.state.location.pathname).toBe(to));
    expect(router.state.location.search).toBe("");
    expect(router.state.location.hash).toBe("");
    expect(router.state.historyAction).toBe("REPLACE");
    await router.navigate(-1);
    expect(router.state.location.pathname).toBe("/previous");
    router.dispose();
  });
});
