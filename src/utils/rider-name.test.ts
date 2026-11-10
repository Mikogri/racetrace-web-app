import { describe, expect, it } from "vitest";
import { abbreviateRiderName } from "./rider-name";

describe("abbreviateRiderName", () => {
  it.each([
    ["Loic Bruni", "L. Bruni"],
    ["  Loic   Bruni ", "L. Bruni"],
    ["Lachlan Stevens-Mcnab", "L. Stevens-Mcnab"],
    ["Ana Maria Silva", "A. Maria Silva"],
    ["Bruni", "Bruni"],
    ["", ""],
  ])("abbreviates %s", (name, expected) => {
    expect(abbreviateRiderName(name)).toBe(expected);
  });
});
