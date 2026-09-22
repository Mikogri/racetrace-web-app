import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLoadDomainMetadata } from "./get-domain-metadata";
import { formatCategoryLabel, useKnownCategories } from "../../../utils/categories";
import { formatSessionLabel, useDomainMetadata } from "../../../utils/domain-metadata";

function MetadataShell() {
  const query = useLoadDomainMetadata();
  return <span>{query.status}</span>;
}

function DictionaryConsumer() {
  useKnownCategories();
  useDomainMetadata();
  return <div>{formatCategoryLabel("NEW_CAT")} / {formatSessionLabel("heat_x", "shortName")}</div>;
}

afterEach(() => vi.unstubAllGlobals());

describe("metadata query", () => {
  it("hydrates labels with one shared request and keeps them when a refresh fails", async () => {
    const payload = {
      categories: [{ code: "new_category", name: "New Category from API", shortName: "NC", displayOrder: 1, aliases: ["NEW_CAT"], gender: "open", minAge: null, maxAge: null }],
      sessionTypes: [{ code: "heat_x", name: "Heat Extra", shortName: "Heat X", abbreviation: "HX", groupName: "Extra Heats", displayOrder: 1, aliases: [] }],
      roundStatuses: [], sessionStatuses: [],
    };
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}>
      <MetadataShell /><MetadataShell /><DictionaryConsumer /><DictionaryConsumer />
    </QueryClientProvider>);
    await waitFor(() => expect(screen.getAllByText("New Category from API / Heat X")).toHaveLength(2));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0]?.[0]).toContain("/api/v1/metadata");
    fetch.mockResolvedValue(new Response("{}", { status: 503 }));
    await client.invalidateQueries({ queryKey: ["domain-metadata"] });
    await waitFor(() => expect(screen.getAllByText("error")).toHaveLength(2));
    expect(screen.getAllByText("New Category from API / Heat X")).toHaveLength(2);
    client.clear();
  });
});
