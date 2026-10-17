import { ApiError } from "../../../types/api";

export const TISSOT_API_ROOT = "https://prod.server.tissottiming.com";
export const CHRONORACE_API_ROOT = "https://prod.chronorace.be/api/results";

export async function getExternalJson(
  url: string,
  signal: AbortSignal,
  allowNotFound = false,
) {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) {
    throw new ApiError(`Live timing source returned ${response.status}.`, {
      code: "http",
      status: response.status,
    });
  }
  return response.json() as Promise<unknown>;
}
