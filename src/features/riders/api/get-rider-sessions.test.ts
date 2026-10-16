import { describe, expect, it } from "vitest";
import { applyDomainMetadata } from "../../../utils/domain-metadata";
import {
  normalizeSessionKind,
  riderSessionResultsSchema,
} from "./get-rider-sessions";

const rawResult = {
  id: 10,
  position: 5,
  status: "Finished",
  is_classified: true,
  top_speed: 48.2,
  awarded_points: 20,
  sessions: {
    id: 20,
    name: "Semi Final",
    session_type: "SF",
    session_date: "2026-06-10",
    categories: { id: 1, code: "EM", name: "Elite Men" },
    conditions: { id: 3, name: "Dry" },
    rounds: {
      id: 30,
      round_number: 3,
      season_year: 2026,
      track_id: 4,
      condition_id: 3,
      competition_class_id: 2,
      tracks: { id: 4, name: "DH Track", venue: "Venue", country_code: "POL" },
      competition_class: { id: 2, code: "world_cup", name: "World Cup" },
    },
  },
};

describe("rider session results", () => {
  it("normalizes every pre-final stage", () => {
    expect(normalizeSessionKind("Q")).toBe("qualifying");
    expect(normalizeSessionKind("Qualifying 1")).toBe("qualifying_1");
    expect(normalizeSessionKind("Q2")).toBe("qualifying_2");
    expect(normalizeSessionKind("Semi-Finals")).toBe("semi_final");
    expect(normalizeSessionKind("Final Run")).toBe("final");
  });

  it("maps nested overview results", () => {
    const [result] = riderSessionResultsSchema.parse([rawResult]);
    expect(result).toMatchObject({
      roundId: "30",
      trackId: "4",
      conditionId: "3",
      competitionClassId: "2",
      category: "elite_men",
      abbreviation: "SF",
      isFinal: false,
      position: 5,
    });
  });

  it.each(['DNS', 'DNF', 'DSQ'])('does not classify a %s result even if a position is present', (status) => {
    const [result] = riderSessionResultsSchema.parse([{ ...rawResult, status }]);
    expect(result.isClassified).toBe(false);
    expect(result.isStart).toBe(status !== 'DNS');
  });

  it("uses new session display metadata without changing classification or chronological order", () => {
    applyDomainMetadata({
      categories: [], roundStatuses: [], sessionStatuses: [],
      sessionTypes: [{ code: "new_heat", name: "New Heat", shortName: "Heat", abbreviation: "NH", groupName: "New Heats", displayOrder: -1, aliases: ["NH"] }],
    });
    const [result] = riderSessionResultsSchema.parse([{
      ...rawResult,
      sessions: { ...rawResult.sessions, session_type: "new_heat" },
    }]);
    expect(result).toMatchObject({ abbreviation: "NH", kind: "other", sessionOrder: 50, isFinal: false, isClassified: true, isStart: true });
  });
});
