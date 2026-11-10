import { useEffect, useRef, useState } from "react";
import riderDot from "../../assets/icons/rider-dot.svg";
import { useRiders } from "../../features/riders/api/get-riders";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import {
  emptyMetricsFilters,
  type MetricsFilters,
  type RiderSummary,
} from "../../types/domain";
import { normalizeDisplayName } from "../../utils/display-name";
import {
  InlineError,
  LoadingState,
  TableFeedbackState,
} from "../feedback/states";
import { SearchInput } from "../forms/search-input";
import { Button } from "../ui/button";
import { Dialog, ModalFooter } from "./dialog";
import styles from "./select-rider-modal.module.css";

type SelectRiderModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (rider: RiderSummary) => void;
  excludedRiderIds?: string[];
  filters?: MetricsFilters;
};

export function SelectRiderModal({
  open,
  onClose,
  onConfirm,
  excludedRiderIds = [],
  filters = emptyMetricsFilters,
}: SelectRiderModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RiderSummary | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [scrollThumb, setScrollThumb] = useState({
    visible: false,
    height: 0,
    top: 0,
  });
  const debouncedSearch = useDebouncedValue(search, 300);
  const ridersQuery = useRiders(
    {
      search: debouncedSearch,
      filters,
      sortBy: "points",
      sortDirection: "desc",
    },
    { enabled: open },
  );

  const handleClose = () => {
    setSearch("");
    setSelected(null);
    onClose();
  };

  const riders = (ridersQuery.data?.items ?? []).filter(
    (rider) => !excludedRiderIds.includes(rider.id),
  );

  useEffect(() => {
    const element = resultsRef.current;
    if (!open || !element) return;
    const update = () => {
      const { clientHeight, scrollHeight, scrollTop } = element;
      if (scrollHeight <= clientHeight) {
        setScrollThumb({ visible: false, height: 0, top: 0 });
        return;
      }
      const height = Math.max(20, (clientHeight * clientHeight) / scrollHeight);
      const top =
        (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - height);
      setScrollThumb({ visible: true, height, top });
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);
    for (const child of element.children) observer?.observe(child);
    return () => {
      element.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, [open, riders.length, ridersQuery.isPending]);

  return (
    <Dialog
      className={styles.dialog}
      open={open}
      title="Select Rider"
      onClose={handleClose}
      initialFocusRef={inputRef}
    >
      <div className={styles.search}>
        <SearchInput
          ref={inputRef}
          className={styles.searchInput}
          value={search}
          label="Search rider by name"
          placeholder="Search rider by name..."
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
      </div>
      <div
        className={styles.results}
        aria-live="polite"
        aria-busy={ridersQuery.isFetching}
      >
        <div className={styles.resultsScroll} ref={resultsRef}>
          {ridersQuery.isError ? (
            <InlineError>{ridersQuery.error.message}</InlineError>
          ) : null}
          {ridersQuery.isPending ? (
            <LoadingState label="Searching riders…" compact />
          ) : null}
          {!ridersQuery.isPending && riders.length === 0 ? (
            <TableFeedbackState
              type="empty"
              compact
              animate={false}
              label="No results"
              description="No riders match the current search and filters."
            />
          ) : (
            <div className={styles.listbox} role="listbox" aria-label="Riders">
              {riders.map((rider) => (
                <button
                  key={rider.id}
                  type="button"
                  role="option"
                  aria-selected={selected?.id === rider.id}
                  className={styles.riderOption}
                  onClick={() => setSelected(rider)}
                >
                  <img className={styles.riderDot} src={riderDot} alt="" />
                  <span className={styles.riderText}>
                    <strong>{normalizeDisplayName(rider.name)}</strong>
                    <span>{normalizeDisplayName(rider.team ?? "--")}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {ridersQuery.isFetching && !ridersQuery.isPending ? (
          <span
            className={styles.updateProgress}
            role="progressbar"
            aria-label="Updating riders"
          >
            <i />
          </span>
        ) : null}
        {scrollThumb.visible ? (
          <span className={styles.scrollbar} aria-hidden="true">
            <span
              className={styles.scrollThumb}
              style={{
                height: scrollThumb.height,
                transform: `translateY(${scrollThumb.top}px)`,
              }}
            />
          </span>
        ) : null}
      </div>
      <ModalFooter>
        <Button fullWidth onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          fullWidth
          disabled={selected === null}
          onClick={() => {
            if (selected) {
              onConfirm(selected);
              setSearch("");
              setSelected(null);
            }
          }}
        >
          Select Rider
        </Button>
      </ModalFooter>
    </Dialog>
  );
}
