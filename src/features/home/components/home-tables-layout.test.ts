import { expect, it } from "vitest";
import css from "../../../components/analytics/home-sections.module.css?raw";

it.each(["lastResultsTable", "currentStandingsTable"])(
  "%s overrides the shared table minimum regardless of CSS import order",
  (table) => {
    const rule = css.match(
      new RegExp(`\\.homePanel\\s+\\.${table}\\s*\\{([^}]+)\\}`),
    )?.[1];
    expect(rule).toBeDefined();
    expect(rule).toMatch(/min-width:\s*0\s*;/);
    expect(rule).toMatch(/table-layout:\s*fixed\s*;/);
  },
);
