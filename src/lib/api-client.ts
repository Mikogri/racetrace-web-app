import type { z } from "zod";
import { env } from "../config/env";
import { ApiError } from "../types/api";
import { measureResponseBody, recordApiResponseDiagnostics } from "./api-request-diagnostics";
import { observeCategoriesInApiPayload } from "../utils/categories";

type RequestOptions<TSchema extends z.ZodType> = Omit<RequestInit, "body"> & {
  path: string;
  schema: TSchema;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
};

function createUrl(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${env.apiBaseUrl}${cleanPath}`, window.location.origin);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return env.apiBaseUrl ? url.toString() : `${url.pathname}${url.search}`;
}

async function request<TSchema extends z.ZodType>({
  path,
  schema,
  query,
  body,
  headers,
  signal,
  ...init
}: RequestOptions<TSchema>): Promise<z.infer<TSchema>> {
  const requestStartedAt = performance.now();
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(
    () => timeoutController.abort("timeout"),
    env.apiTimeoutMs,
  );
  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal;

  try {
    const requestHeaders = new Headers(headers);
    requestHeaders.set("Accept", "application/json");
    if (body !== undefined)
      requestHeaders.set("Content-Type", "application/json");

    const response = await fetch(createUrl(path, query), {
      ...init,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      headers: requestHeaders,
      signal: requestSignal,
    });

    const responseText = await response.text();
    const bodyMeasurement = measureResponseBody(responseText, response.headers);
    let payload: unknown = null;
    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch {
      payload = null;
    }
    if (!response.ok) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof payload.error === "object" &&
        payload.error !== null &&
        "message" in payload.error &&
        typeof payload.error.message === "string"
          ? payload.error.message
          : `${response.status} ${response.statusText}`;
      throw new ApiError(message, {
        code: "http",
        status: response.status,
        details: payload,
        retryAfter: response.headers.get("Retry-After"),
      });
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError("API response has an unsupported format.", {
        code: "validation",
        status: response.status,
        details: parsed.error.flatten(),
      });
    }

    observeCategoriesInApiPayload(payload);

    recordApiResponseDiagnostics(parsed.data, requestStartedAt, response.headers, bodyMeasurement);
    return parsed.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      const timedOut = timeoutController.signal.aborted && !signal?.aborted;
      throw new ApiError(
        timedOut ? "Request timed out." : "Request was cancelled.",
        {
          code: timedOut ? "timeout" : "aborted",
        },
      );
    }
    throw new ApiError("Unable to connect to the RaceTrace API.", {
      code: "network",
      details: error,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const apiClient = {
  get: <TSchema extends z.ZodType>(
    path: string,
    schema: TSchema,
    options?: Omit<
      RequestOptions<TSchema>,
      "method" | "path" | "schema" | "body"
    >,
  ) => request({ ...options, method: "GET", path, schema }),
  post: <TSchema extends z.ZodType>(
    path: string,
    schema: TSchema,
    body: unknown,
    options?: Omit<
      RequestOptions<TSchema>,
      "method" | "path" | "schema" | "body"
    >,
  ) => request({ ...options, method: "POST", path, schema, body }),
};
