import { describe, expect, it } from "vitest";
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
});
