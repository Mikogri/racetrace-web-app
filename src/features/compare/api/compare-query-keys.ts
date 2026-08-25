export const compareQueryKeys = {
  all: ['compare'] as const,
  detail: (riderIds: string[], filters: Record<string, unknown>) =>
    [...compareQueryKeys.all, [...riderIds].sort(), filters] as const,
}
