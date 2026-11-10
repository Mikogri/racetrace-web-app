export const resultsQueryKeys = {
  all: ["results"] as const,
  lists: () => [...resultsQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...resultsQueryKeys.lists(), filters] as const,
  detail: (resultId: string) =>
    [...resultsQueryKeys.all, "detail", resultId] as const,
};
