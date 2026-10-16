export const riderQueryKeys = {
  all: ["riders"] as const,
  lists: () => [...riderQueryKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...riderQueryKeys.lists(), params] as const,
  details: () => [...riderQueryKeys.all, "detail"] as const,
  detail: (riderId: string) => [...riderQueryKeys.details(), riderId] as const,
  overview: (riderId: string, filters: Record<string, unknown>) =>
    [...riderQueryKeys.detail(riderId), "overview", filters] as const,
};
