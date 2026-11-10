import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import { joinClassNames } from "../../utils/join-class-names";
import { Typography } from "../ui/typography";
import styles from "./page-container.module.css";

export function PageContainer({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <main className={joinClassNames(styles.container, className)} {...props}>
      {children}
    </main>
  );
}

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
}: PageHeaderProps) {
  const captionParts =
    eyebrow
      ?.split(/\s*\/+\s*/)
      .map((part) => part.trim())
      .filter(Boolean) ?? [];

  return (
    <header className={styles.pageHeader}>
      <div className={styles.headerCopy}>
        <Typography as="h1" variant="pageTitle">
          {title}
        </Typography>
        {captionParts.length > 0 ? (
          <Typography variant="caption" className={styles.pageCaption}>
            <span className={styles.captionSlash} aria-hidden="true">
              //
            </span>
            {captionParts.map((part, index) => (
              <Fragment key={`${part}-${index}`}>
                <span>{part}</span>
                {index < captionParts.length - 1 ? (
                  <span className={styles.captionSlash} aria-hidden="true">
                    //
                  </span>
                ) : null}
              </Fragment>
            ))}
          </Typography>
        ) : null}
        {description ? (
          <Typography className={styles.description}>{description}</Typography>
        ) : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}

export function Section({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={joinClassNames(styles.section, className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.headerCopy}>
        <Typography as="h2" variant="sectionTitle">
          {title}
        </Typography>
        {description ? <Typography>{description}</Typography> : null}
      </div>
      {action}
    </div>
  );
}
