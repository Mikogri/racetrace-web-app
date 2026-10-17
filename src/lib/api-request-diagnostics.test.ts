import { describe, expect, it, vi } from "vitest";
import { getApiResponseMeta } from "./api-response-meta";
import { measureResponseBody, recordApiResponseDiagnostics } from "./api-request-diagnostics";

describe("API request diagnostics", () => {
  it("counts UTF-8 body bytes separately from transferred bytes", () => {
    expect(measureResponseBody("ż", new Headers({ "content-length": "1" })))
      .toEqual({ responseBytes: 2, transferredBytes: 1 });
  });

  it.each([null, "invalid", "-1", "Infinity"])("keeps unavailable transferred size null: %s", (length) => {
    const headers = new Headers();
    if (length !== null) headers.set("content-length", length);
    expect(measureResponseBody("", headers)).toEqual({ responseBytes: 0, transferredBytes: null });
  });

  it("records elapsed time at successful validation without copying the response", () => {
    const now = vi.spyOn(performance, "now").mockReturnValue(150);
    try {
      const data = { items: [] };
      recordApiResponseDiagnostics(data, 100, new Headers({ "server-timing": "api;dur=30" }), {
        responseBytes: 20, transferredBytes: 0,
      });
      expect(getApiResponseMeta(data)).toEqual({ durationMs: 50, responseBytes: 20, transferredBytes: 0, serverTimings: { api: 30 } });
      expect(getApiResponseMeta({ ...data })).toBeUndefined();
    } finally {
      now.mockRestore();
    }
  });
});
