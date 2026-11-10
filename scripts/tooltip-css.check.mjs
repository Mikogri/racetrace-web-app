import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { build } from "vite";

test("production tooltip CSS retains a browser-supported backdrop blur", async () => {
  const bundle = await build({
    configFile: false,
    logLevel: "silent",
    build: {
      write: false,
      rollupOptions: {
        input: fileURLToPath(
          new URL(
            "../src/components/overlays/tooltip.module.css",
            import.meta.url,
          ),
        ),
      },
    },
  });
  assert.ok("output" in bundle);
  const css = bundle.output
    .filter(
      (asset) => asset.type === "asset" && asset.fileName.endsWith(".css"),
    )
    .map((asset) => asset.source)
    .join("\n");
  assert.match(css, /(?:^|[;{])backdrop-filter:blur\(5px\)/);
  assert.match(css, /background:(?:#0a0a0a40|rgb\(10 10 10\s*\/\s*25%\))/);
});
