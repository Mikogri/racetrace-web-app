import { describe, expect, it } from "vitest";
import * as registry from "./categories";
import {
  categoryMatchesGender,
  getKnownCategories,
  normalizeCategoryValue,
  observeCategoriesInApiPayload,
} from "./categories";

describe("category registry", () => {
  it("always starts with the four standard downhill categories", () => {
    expect(
      getKnownCategories()
        .slice(0, 4)
        .map((category) => category.value),
    ).toEqual(["elite_men", "elite_women", "junior_men", "junior_women"]);
  });

  it("discovers a category and its gender in any API payload", () => {
    observeCategoriesInApiPayload({
      round: {
        categories: [{ code: "MU17", name: "Men U17", gender: "male" }],
      },
    });

    const discovered = getKnownCategories().find(
      (category) => category.value === "MU17",
    );
    expect(discovered).toMatchObject({ label: "Men U17", gender: "male" });
    expect(categoryMatchesGender(discovered!, "female")).toBe(false);
    expect(categoryMatchesGender(discovered!, "male")).toBe(true);
  });

  it("keeps unknown public category codes instead of dropping them", () => {
    expect(normalizeCategoryValue("Open_U17")).toBe("Open_U17");
  });

  it("does not lose a discovered name and gender to a later code-only payload", () => {
    observeCategoriesInApiPayload({ categories: [{ code: "MU19", name: "Men Under 19", gender: "male" }] });
    observeCategoriesInApiPayload({ category: "MU19" });
    expect(getKnownCategories().find((category) => category.value === "MU19"))
      .toMatchObject({ label: "Men Under 19", gender: "male" });
  });

  it("uses authoritative metadata labels, aliases and order without sparse payload overrides", () => {
    expect(registry.registerCategoryMetadata).toBeTypeOf("function");
    registry.registerCategoryMetadata([
      { code: "masters_open", name: "Masters Open", shortName: "MO", displayOrder: 1, aliases: ["MO"], gender: "open" },
      { code: "elite_men", name: "Men Elite Updated", shortName: "MEU", displayOrder: 2, aliases: ["EM"], gender: "male" },
    ]);
    expect(getKnownCategories().slice(0, 2)).toEqual([
      { value: "masters_open", label: "Masters Open", abbreviation: "MO", gender: "open" },
      { value: "elite_men", label: "Men Elite Updated", abbreviation: "MEU", gender: "male" },
    ]);
    expect(normalizeCategoryValue("MO")).toBe("masters_open");
    observeCategoriesInApiPayload({ categories: [{ code: "EM", name: "Obsolete label" }], category: "masters_open" });
    expect(registry.formatCategoryLabel("EM")).toBe("Men Elite Updated");
    expect(registry.formatCategoryAbbreviation("masters_open")).toBe("MO");
  });
});
