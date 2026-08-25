import { useMemo, useState } from "react";
import { GLOBAL_PAGE_SIZE } from "../config/pagination";
import type { SortDirection } from "../components/data-display/data-table";

type SortValue = string | number | null | undefined;

export function useClientTable<TItem, TSort extends string>(
  items: TItem[],
  accessors: Record<TSort, (item: TItem) => SortValue>,
  initialSort: TSort,
  initialDirection: SortDirection = "asc",
  pageSize = GLOBAL_PAGE_SIZE,
  secondaryAccessor?: (item: TItem) => SortValue,
  secondaryDirection: SortDirection = "desc",
) {
  const [sortBy, setSortBy] = useState<TSort>(initialSort);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialDirection);
  const [requestedPage, setRequestedPage] = useState(1);

  const sortedItems = useMemo(() => {
    const accessor = accessors[sortBy];
    const direction = sortDirection === "asc" ? 1 : -1;
    const compareValues = (
      leftValue: SortValue,
      rightValue: SortValue,
      valueDirection: number,
    ) => {
      if (leftValue == null && rightValue == null) return 0;
      if (leftValue == null) return 1;
      if (rightValue == null) return -1;
      if (typeof leftValue === "number" && typeof rightValue === "number")
        return (leftValue - rightValue) * valueDirection;
      return (
        String(leftValue).localeCompare(String(rightValue), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * valueDirection
      );
    };

    return [...items].sort((left, right) => {
      const primary = compareValues(accessor(left), accessor(right), direction);
      if (primary !== 0 || !secondaryAccessor) return primary;
      return compareValues(
        secondaryAccessor(left),
        secondaryAccessor(right),
        secondaryDirection === "asc" ? 1 : -1,
      );
    });
  }, [
    accessors,
    items,
    secondaryAccessor,
    secondaryDirection,
    sortBy,
    sortDirection,
  ]);

  const totalPages =
    sortedItems.length === 0 ? 0 : Math.ceil(sortedItems.length / pageSize);
  const page = Math.min(requestedPage, Math.max(totalPages, 1));
  const pageItems = sortedItems.slice((page - 1) * pageSize, page * pageSize);

  const updateSort = (nextSort: TSort) => {
    setSortDirection((current) =>
      sortBy === nextSort && current === "desc" ? "asc" : "desc",
    );
    setSortBy(nextSort);
    setRequestedPage(1);
  };

  return {
    items: pageItems,
    page,
    pageSize,
    totalPages,
    sortBy,
    sortDirection,
    updateSort,
    setPage: setRequestedPage,
  };
}
