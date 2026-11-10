import { afterEach, describe, expect, it, vi } from "vitest";
import { getRiders } from "./get-riders";

afterEach(() => vi.restoreAllMocks());

describe("camelCase rider list API", () => {
  it("parses canonical rider fields and pagination without changing query aliases", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            {
              riderId: 7,
              firstName: "Rider",
              lastName: "Name",
              teamName: "Team",
              countryCode: "POL",
              profileImageUrl: "photo.png",
            },
          ],
          page: 2,
          pageSize: 10,
          totalItems: 42,
          totalPages: 5,
        }),
      ),
    );
    const result = await getRiders({
      search: "Rider",
      pageSize: 10,
      filters: {
        seasons: ["2026"],
        tracks: [],
        conditions: [],
        classes: [],
        categories: ["elite_men"],
      },
    });
    expect(result).toEqual({
      items: [
        {
          id: "7",
          name: "Rider Name",
          team: "Team",
          country: "POL",
          category: null,
          profileImageUrl: "photo.png",
        },
      ],
      pagination: { page: 2, pageSize: 10, totalItems: 42, totalPages: 5 },
    });
    const url = new URL(String(fetch.mock.calls[0][0]), window.location.origin);
    expect(url.pathname).toBe("/api/v1/riders");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      search: "Rider",
      sortBy: "fullName",
      sortDirection: "asc",
      pageSize: "10",
      season: "2026",
      category: "elite_men",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
