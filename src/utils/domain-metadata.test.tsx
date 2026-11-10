import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as metadata from "./domain-metadata";

describe("domain display metadata", () => {
  it("preserves contextual fallback labels and displays unknown types without dropping their names", () => {
    expect(metadata.formatSessionLabel).toBeTypeOf("function");
    expect(metadata.formatSessionLabel("Q1", "shortName")).toBe("Quali 1");
    expect(metadata.formatSessionLabel("Q1")).toBe("Qualifying 1");
    expect(metadata.formatSessionLabel("final", "groupName")).toBe("Finals");
    expect(metadata.formatSessionLabel("SF", "abbreviation")).toBe("SF");
    expect(metadata.formatSessionLabel("Other", "abbreviation")).toBe("O");
    expect(metadata.formatSessionLabel("TIMED_TRAINING", "abbreviation")).toBe(
      "O",
    );
    expect(metadata.formatSessionLabel("PRACTICE", "abbreviation")).toBe("O");
    expect(metadata.formatSessionLabel("super_final", "shortName")).toBe(
      "Super Final",
    );
    expect(
      metadata.formatSessionLabel(
        "Provider Run 3",
        "shortName",
        "Provider Run 3",
      ),
    ).toBe("Provider Run 3");
  });

  it("refreshes rendered labels and resolves new metadata aliases", () => {
    expect(metadata.applyDomainMetadata).toBeTypeOf("function");
    function Label() {
      metadata.useDomainMetadata();
      return <span>{metadata.formatSessionLabel("SX", "shortName")}</span>;
    }
    render(<Label />);
    expect(screen.getByText("SX")).toBeInTheDocument();
    act(() =>
      metadata.applyDomainMetadata({
        categories: [],
        roundStatuses: [],
        sessionStatuses: [
          {
            code: "paused",
            name: "Timing Paused",
            shortName: "Paused",
            displayOrder: 8,
            aliases: ["hold"],
          },
        ],
        sessionTypes: [
          {
            code: "super_final",
            name: "Super Final Run",
            shortName: "Super",
            abbreviation: "SX",
            groupName: "Super Finals",
            displayOrder: 7,
            aliases: ["SX"],
          },
        ],
      }),
    );
    expect(screen.getByText("Super")).toBeInTheDocument();
    expect(metadata.formatSessionLabel("super_final", "groupName")).toBe(
      "Super Finals",
    );
    expect(metadata.formatDomainLabel("sessionStatuses", "hold")).toBe(
      "Timing Paused",
    );
    expect(metadata.formatDomainLabel("roundStatuses", "new_status")).toBe(
      "New Status",
    );
  });

  it("rejects malformed dictionary responses instead of replacing usable metadata", () => {
    expect(metadata.domainMetadataSchema).toBeDefined();
    expect(
      metadata.domainMetadataSchema.safeParse({ categories: [] }).success,
    ).toBe(false);
  });

  it("resolves live display names by stable type before provider text and preserves unknown provider names", () => {
    expect(metadata.formatLiveSessionLabel).toBeTypeOf("function");
    metadata.applyDomainMetadata({
      categories: [],
      roundStatuses: [],
      sessionStatuses: [],
      sessionTypes: [
        {
          code: "heat_x",
          name: "Database Heat",
          shortName: "DB Heat",
          abbreviation: "HX",
          groupName: "Database Heats",
          displayOrder: 9,
          aliases: ["HEAT_X"],
        },
      ],
    });
    expect(
      metadata.formatLiveSessionLabel(
        { sessionType: "HEAT_X", name: "Provider Special Run" },
        "shortName",
      ),
    ).toBe("DB Heat");
    expect(
      metadata.formatLiveSessionLabel({
        sessionType: "HEAT_X",
        name: "Provider Special Run",
      }),
    ).toBe("Database Heat");
    expect(
      metadata.formatLiveSessionLabel(
        { sessionType: null, name: "Database Heat" },
        "shortName",
      ),
    ).toBe("DB Heat");
    expect(
      metadata.formatLiveSessionLabel(
        { sessionType: "unknown_code", name: "Provider Special Run" },
        "shortName",
      ),
    ).toBe("Provider Special Run");
    expect(
      metadata.formatLiveSessionLabel({
        sessionType: null,
        name: "Provider Special Run",
      }),
    ).toBe("Provider Special Run");
  });
});
