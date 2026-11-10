import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

// Point to an already installed Playwright; this script installs nothing.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const output = process.env.BENCHMARK_OUTPUT ?? "artifacts/production-browser";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const path of [
    "/results?season=2026",
    "/ranking?season=2026",
    "/compare?riderA=18&riderB=183&season=2026&category=elite_men",
    "/",
  ]) {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const api = [];
    page.on("response", (response) => {
      if (new URL(response.url()).pathname.startsWith("/api/"))
        api.push({
          path: new URL(response.url()).pathname,
          status: response.status(),
        });
    });
    await page.goto(`https://racetracemtb.com${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    // Observe a bounded window rather than networkidle: some screens poll intentionally.
    await page.waitForTimeout(12000);
    const timing = await page.evaluate(() => ({
      navigation: performance.getEntriesByType("navigation").map((n) => ({
        ttfb: n.responseStart,
        domReady: n.domContentLoadedEventEnd,
        load: n.loadEventEnd,
      })),
      paints: performance
        .getEntriesByType("paint")
        .map((p) => ({ name: p.name, at: p.startTime })),
      api: performance
        .getEntriesByType("resource")
        .filter((r) => new URL(r.name).pathname.startsWith("/api/"))
        .map((r) => ({
          path: new URL(r.name).pathname,
          start: r.startTime,
          duration: r.duration,
          transferredBytes: r.transferSize,
        })),
      visibleData: {
        tableRows: document.querySelectorAll("tbody tr").length,
        headings: document.querySelectorAll("h1,h2,h3").length,
      },
    }));
    results.push({ path, timing, responses: api });
    await writeFile(
      `${output}/browser.json`,
      JSON.stringify(
        {
          measuredAt: new Date().toISOString(),
          scope:
            "Deployed page, fresh browser context, reduced motion, fixed 12s observation. FCP is not time to loaded data; no SQL/server timing inferred.",
          results,
        },
        null,
        2,
      ),
    );
    console.log(
      `${path}: ${api.length} API responses, ${timing.api.length} measured resources`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
