import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().trim().default(""),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().default(12_000),
});

const parsedEnv = envSchema.parse(import.meta.env);

export const env = {
  apiBaseUrl: parsedEnv.VITE_API_BASE_URL.replace(/\/$/, ""),
  apiTimeoutMs: parsedEnv.VITE_API_TIMEOUT_MS,
} as const;
