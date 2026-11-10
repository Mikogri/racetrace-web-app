import { isValidElement } from "react";
import { afterAll, expect, it } from "vitest";
import { matchRoutes } from "react-router-dom";
import { router } from "./router";

afterAll(() => router.dispose());

it("makes every page component available without a lazy or Suspense boundary", () => {
  const root = router.routes[0]!;
  for (const route of root.children ?? []) {
    for (const candidate of [route, ...(route.children ?? [])]) {
      expect(candidate.lazy).toBeUndefined();
      expect(isValidElement(candidate.element)).toBe(true);
      if (isValidElement(candidate.element))
        expect(typeof candidate.element.type).toBe("function");
    }
  }
});

it("preserves rider subpages and round detail routes", () => {
  for (const path of [
    "/ranking",
    "/results/rounds/12",
    "/ranking/riders/16",
    "/ranking/riders/16/results",
    "/ranking/riders/16/tracks",
  ]) {
    const matches = matchRoutes(router.routes, path);
    expect(matches?.at(-1)?.route.path).not.toBe("*");
    expect(matches?.length).toBeGreaterThan(1);
  }
});
