import { Fragment, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AppTooltip } from "../overlays/tooltip";
import { useKnownCategories } from "../../utils/categories";
import styles from "./home-sections.module.css";

export function SectionHeader({
  title,
  meta,
  description,
}: {
  title: string;
  meta: Array<ReactNode>;
  description: string;
}) {
  return (
    <header className={styles.sectionHeader}>
      <h2>{title}</h2>
      <div className={styles.sectionMeta}>
        {meta.map((item, index) => (
          <Fragment key={index}>
            <span className={styles.metaSlash}>//</span>
            <span>{item}</span>
          </Fragment>
        ))}
      </div>
      <p>{description}</p>
    </header>
  );
}

export function SectionAction({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link className={styles.sectionAction} to={to}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function isJuniorCategory(value: string, label: string) {
  const descriptor = `${value} ${label}`.replaceAll("_", " ");
  if (/\bjunior\b/i.test(descriptor)) return true;
  const ageLimit = descriptor.match(/\b(?:u|under)\s*-?\s*(\d{1,2})\b/i);
  return ageLimit ? Number(ageLimit[1]) <= 19 : false;
}

export function CategorySelector({
  value,
  onChange,
  compact = false,
  excludeJunior = false,
}: {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  excludeJunior?: boolean;
}) {
  const categories = useKnownCategories();
  const visibleCategories = excludeJunior
    ? categories.filter(
        (category) => !isJuniorCategory(category.value, category.label),
      )
    : categories;

  useEffect(() => {
    if (
      visibleCategories.length > 0 &&
      !visibleCategories.some((category) => category.value === value)
    )
      onChange(visibleCategories[0].value);
  }, [onChange, value, visibleCategories]);

  return (
    <div
      className={`${styles.categorySelector} ${compact ? styles.categorySelectorCompact : ""}`}
      role="group"
      aria-label="Result category"
    >
      {visibleCategories.map((category) => {
        const button = (
          <button
            type="button"
            aria-pressed={value === category.value}
            aria-label={category.label}
            onClick={() => onChange(category.value)}
          >
            {compact ? category.abbreviation : category.label}
          </button>
        );

        return compact ? (
          <AppTooltip content={category.label} key={category.value}>
            {button}
          </AppTooltip>
        ) : (
          <Fragment key={category.value}>{button}</Fragment>
        );
      })}
    </div>
  );
}
