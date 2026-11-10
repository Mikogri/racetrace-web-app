import type { components } from "./generated/api";

export type ApiSchema<Name extends keyof components["schemas"]> =
  components["schemas"][Name];
// Check wire input, not presentation output: Zod intentionally normalizes IDs and supplies defaults.
export type AssertApiContract<Compatible extends true> = Compatible;
