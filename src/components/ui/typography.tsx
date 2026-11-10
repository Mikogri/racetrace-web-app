import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { joinClassNames } from "../../utils/join-class-names";
import styles from "./typography.module.css";

type TypographyVariant =
  "pageTitle" | "sectionTitle" | "panelTitle" | "body" | "data" | "caption";

type TypographyProps<T extends ElementType> = {
  as?: T;
  variant?: TypographyVariant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Typography<T extends ElementType = "p">({
  as,
  variant = "body",
  children,
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? "p";
  return (
    <Component
      className={joinClassNames(styles.base, styles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
