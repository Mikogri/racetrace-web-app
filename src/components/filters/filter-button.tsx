import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import chevron from "../../assets/icons/chevron.png";
import { joinClassNames } from "../../utils/join-class-names";
import styles from "./filter-button.module.css";

type FilterButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  expanded?: boolean;
};

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  function FilterButton(
    { children, expanded = false, className, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={joinClassNames(styles.button, className)}
        aria-expanded={expanded}
        {...props}
      >
        <span>{children}</span>
        <img
          className={joinClassNames(
            styles.chevron,
            expanded && styles.expanded,
          )}
          src={chevron}
          alt=""
        />
      </button>
    );
  },
);
