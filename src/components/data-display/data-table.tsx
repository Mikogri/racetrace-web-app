import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";
import { joinClassNames } from "../../utils/join-class-names";
import styles from "./data-table.module.css";

export function DataTable({
  className,
  embedded = false,
  loading = false,
  children,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & {
  embedded?: boolean;
  loading?: boolean;
}) {
  return (
    <div
      className={joinClassNames(
        styles.scrollArea,
        embedded ? styles.embedded : undefined,
        loading ? styles.loading : undefined,
      )}
      tabIndex={0}
    >
      {loading ? (
        <div
          className={styles.tableProgress}
          role="progressbar"
          aria-label="Loading new table data"
        >
          <span />
        </div>
      ) : null}
      <table className={joinClassNames(styles.table, className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function DataTableHeader({ children }: { children: ReactNode }) {
  return <thead className={styles.header}>{children}</thead>;
}

export function DataTableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={joinClassNames(styles.row, className)} {...props} />;
}

export function RiderTableRow({
  riderId,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { riderId: string | null }) {
  return (
    <DataTableRow
      {...props}
      className={className}
      data-rider-id={riderId ?? undefined}
    />
  );
}

export type SortDirection = "asc" | "desc";

export function SortableTableHeader<TSort extends string>({
  label,
  sortKey,
  activeSort,
  direction,
  onSort,
  ariaLabel,
  column,
}: {
  label: ReactNode;
  sortKey: TSort;
  activeSort: TSort;
  direction: SortDirection;
  onSort: (sortKey: TSort) => void;
  ariaLabel?: string;
  column?: string;
}) {
  const active = sortKey === activeSort;

  return (
    <th
      scope="col"
      data-column={column}
      aria-sort={
        active ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        className={styles.sortButton}
        type="button"
        onClick={() => onSort(sortKey)}
        aria-label={ariaLabel}
      >
        <span>{label}</span>
        {active ? (
          <svg
            className={styles.sortArrow}
            viewBox="0 0 10 10"
            aria-hidden="true"
          >
            {direction === "asc" ? (
              <path d="M2 6.5 5 3.5l3 3" />
            ) : (
              <path d="m2 3.5 3 3 3-3" />
            )}
          </svg>
        ) : null}
      </button>
    </th>
  );
}
