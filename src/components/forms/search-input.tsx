import { forwardRef, type InputHTMLAttributes } from "react";
import { joinClassNames } from "../../utils/join-class-names";
import styles from "./search-input.module.css";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ label = "Search", className, ...props }, ref) {
    return (
      <label className={joinClassNames(styles.field, className)}>
        <span className="srOnly">{label}</span>
        <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="m12.5 12.5 4 4" />
        </svg>
        <input ref={ref} type="search" className={styles.input} {...props} />
      </label>
    );
  },
);
