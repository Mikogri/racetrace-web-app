import styles from "./pagination.module.css";

type PaginationItem = number | "start-ellipsis" | "end-ellipsis";

function visiblePages(page: number, totalPages: number): PaginationItem[] {
  const total = Math.max(totalPages, 1);
  const current = Math.min(Math.max(page, 1), total);
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "end-ellipsis", total];
  if (current >= total - 3)
    return [
      1,
      "start-ellipsis",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total,
    ];
  return [
    1,
    "start-ellipsis",
    current - 1,
    current,
    current + 1,
    "end-ellipsis",
    total,
  ];
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const pages = visiblePages(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <span>Rows per page: {pageSize}</span>
      <div className={styles.actions} aria-label="Pages">
        <button
          className={styles.arrowItem}
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <svg className={styles.arrow} viewBox="0 0 6 12" aria-hidden="true">
            <path d="M5.25.75.75 6l4.5 5.25" />
          </svg>
        </button>
        {pages.map((pageNumber) =>
          typeof pageNumber === "number" ? (
            <button
              className={pageNumber === page ? styles.activeItem : styles.item}
              type="button"
              key={pageNumber}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ) : (
            <span
              className={styles.ellipsis}
              aria-hidden="true"
              key={pageNumber}
            >
              ...
            </span>
          ),
        )}
        <button
          className={styles.arrowItem}
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <svg className={styles.arrow} viewBox="0 0 6 12" aria-hidden="true">
            <path d="M.75.75 5.25 6l-4.5 5.25" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
