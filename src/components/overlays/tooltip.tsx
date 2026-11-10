import {
  useLayoutEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import styles from "./tooltip.module.css";

export function AppTooltip({
  children,
  content,
  label,
}: {
  children: ReactNode;
  content: ReactNode;
  label?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });
  const hover = useHover(context, { delay: { open: 250, close: 80 } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <span
        className={styles.reference}
        ref={setReference}
        {...getReferenceProps()}
      >
        {children}
      </span>
      {open ? (
        <FloatingPortal>
          <div
            className={styles.floating}
            ref={setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <TooltipSurface content={content} {...(label ? { label } : {})} />
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
}

export function TooltipSurface({
  content,
  label,
}: {
  content: ReactNode;
  label?: ReactNode;
}) {
  return (
    <div className={styles.surface}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.value}>{content}</div>
    </div>
  );
}

export function TooltipRows({ rows }: { rows: ReactNode[] }) {
  return (
    <span className={styles.rows}>
      {rows.map((row, index) => (
        <span key={index}>{row}</span>
      ))}
    </span>
  );
}

export function ChartTooltip({
  active,
  coordinate,
  containerRef,
  content,
  label,
}: {
  active?: boolean | undefined;
  coordinate?: { x?: number; y?: number } | undefined;
  containerRef: RefObject<HTMLElement | null>;
  content: ReactNode;
  label?: ReactNode;
}) {
  const open = Boolean(
    active && Number.isFinite(coordinate?.x) && Number.isFinite(coordinate?.y),
  );
  const {
    refs: { setReference, setFloating },
    floatingStyles,
    isPositioned,
  } = useFloating({
    open,
    placement: "top",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const x = coordinate?.x;
    const y = coordinate?.y;
    if (!open || !container || !Number.isFinite(x) || !Number.isFinite(y)) {
      setReference(null);
      return;
    }

    setReference({
      contextElement: container,
      getBoundingClientRect() {
        const bounds = container.getBoundingClientRect();
        return new DOMRect(
          bounds.left + Number(x),
          bounds.top + Number(y),
          0,
          0,
        );
      },
    });

    return () => setReference(null);
  }, [containerRef, coordinate?.x, coordinate?.y, open, setReference]);

  if (!open) return null;

  return (
    <FloatingPortal>
      <div
        className={styles.floating}
        ref={setFloating}
        style={{
          ...floatingStyles,
          visibility: isPositioned ? "visible" : "hidden",
        }}
      >
        <TooltipSurface content={content} {...(label ? { label } : {})} />
      </div>
    </FloatingPortal>
  );
}
