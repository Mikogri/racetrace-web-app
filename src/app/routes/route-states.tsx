import {
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import {
  ErrorState,
  TableFeedbackState,
} from "../../components/feedback/states";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { routes } from "../../config/routes";
import styles from "./route-states.module.css";
import { pageMeta } from "../../config/seo";
import { usePageMeta } from "../../hooks/use-page-meta";

export function RouteLoadingPage() {
  const { pathname } = useLocation();
  const layout =
    pathname === "/"
      ? "home"
      : pathname === routes.results
        ? "cards"
        : pathname === routes.compare
          ? "compare"
          : pathname === routes.fantasy
            ? "fantasy"
          : pathname === routes.about || pathname === routes.privacyPolicy
            ? "info"
            : /^\/results\/[^/]+/.test(pathname) ||
                pathname.startsWith("/live/results/")
              ? "roundDetails"
              : pathname.startsWith("/riders/")
                ? "details"
                : "table";

  return (
    <PageContainer
      className={`${styles.skeletonPage} ${layout === "home" ? styles.homeSkeletonPage : ""}`}
      aria-busy="true"
      aria-label="Loading page"
    >
      <span className="srOnly" role="status">
        Loading page
      </span>
      {layout === "home" ? (
        <HomeHeroSkeleton />
      ) : (
        <div className={styles.skeletonHeader} aria-hidden="true">
          <div className={styles.captionRow}>
            <span className={`${styles.skeleton} ${styles.caption}`} />
            <span className={`${styles.skeleton} ${styles.captionShort}`} />
            <span className={`${styles.skeleton} ${styles.caption}`} />
          </div>
          <span className={`${styles.skeleton} ${styles.title}`} />
          <div className={styles.description}>
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </div>
        </div>
      )}
      <div className={styles.skeletonBody} aria-hidden="true">
        {layout === "home" ? <HomeSkeleton /> : null}
        {layout === "cards" ? <CardsSkeleton /> : null}
        {layout === "compare" ? <CompareSkeleton /> : null}
        {layout === "fantasy" ? <><PanelSkeleton compact /><TableSkeleton /></> : null}
        {layout === "info" ? <InfoSkeleton /> : null}
        {layout === "roundDetails" ? <RoundDetailsSkeleton /> : null}
        {layout === "details" ? <DetailsSkeleton /> : null}
        {layout === "table" ? <TableSkeleton /> : null}
      </div>
    </PageContainer>
  );
}

function ControlsSkeleton() {
  return (
    <div className={styles.controls}>
      <span className={`${styles.skeleton} ${styles.controlWide}`} />
      <span className={`${styles.skeleton} ${styles.control}`} />
      <span className={`${styles.skeleton} ${styles.control}`} />
    </div>
  );
}

function PanelSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.panel} ${compact ? styles.compactPanel : ""}`}>
      <div className={styles.panelHeader}>
        <span className={`${styles.skeleton} ${styles.panelTitle}`} />
        <span className={`${styles.skeleton} ${styles.panelDescription}`} />
      </div>
      <div className={styles.rows}>
        {Array.from({ length: compact ? 3 : 7 }, (_, index) => (
          <span className={styles.skeleton} key={index} />
        ))}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <>
      <ControlsSkeleton />
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={`${styles.skeleton} ${styles.panelTitle}`} />
          <span className={`${styles.skeleton} ${styles.panelDescription}`} />
        </div>
        <div className={styles.tableHeaderSkeleton}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={styles.skeleton} key={index} />
          ))}
        </div>
        <div className={styles.rows}>
          {Array.from({ length: 7 }, (_, index) => (
            <span className={styles.skeleton} key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

function CardsSkeleton() {
  return (
    <>
      <div className={styles.seasonSkeleton}>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            className={`${styles.skeleton} ${styles.seasonItem}`}
            key={index}
          />
        ))}
      </div>
      <div className={styles.cardGrid}>
        {Array.from({ length: 8 }, (_, index) => (
          <div className={styles.cardSkeleton} key={index}>
            <span className={`${styles.skeleton} ${styles.cardImage}`} />
            <div className={styles.cardCopy}>
              <span className={styles.skeleton} />
              <span className={`${styles.skeleton} ${styles.cardTitle}`} />
              <span className={styles.skeleton} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function HomeSkeleton() {
  return (
    <div className={styles.homeSkeletonSections}>
      {Array.from({ length: 6 }, (_, index) => (
        <HomeSectionSkeleton table={index !== 0 && index !== 2} key={index} />
      ))}
    </div>
  );
}

function HomeHeroSkeleton() {
  return (
    <div className={styles.homeHeroSkeleton} aria-hidden="true">
      <div className={styles.homeHeroTitle}>
        <div className={styles.homeHeroDots}>
          <span />
          <span />
          <span />
        </div>
        <span className={`${styles.skeleton} ${styles.homeHeroHeading}`} />
        <span className={`${styles.skeleton} ${styles.homeHeroEyebrow}`} />
      </div>
      <div className={styles.homeHeroDescription}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.skeleton} key={index} />
        ))}
      </div>
    </div>
  );
}

function HomeSectionSkeleton({ table }: { table: boolean }) {
  return (
    <div className={styles.homeSectionSkeleton}>
      <div className={styles.homeSectionHeaderSkeleton}>
        <span className={`${styles.skeleton} ${styles.homeSectionTitle}`} />
        <div className={styles.homeSectionMetaSkeleton}>
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
        </div>
        <span
          className={`${styles.skeleton} ${styles.homeSectionDescription}`}
        />
      </div>
      <div className={styles.homeSectionPanelSkeleton}>
        <div className={styles.homePanelTopSkeleton}>
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
        </div>
        {table ? (
          <div className={styles.rows}>
            {Array.from({ length: 4 }, (_, index) => (
              <span className={styles.skeleton} key={index} />
            ))}
          </div>
        ) : (
          <div className={styles.homeMetricSkeleton}>
            {Array.from({ length: 4 }, (_, index) => (
              <span className={styles.skeleton} key={index} />
            ))}
          </div>
        )}
      </div>
      <span className={`${styles.skeleton} ${styles.homeActionSkeleton}`} />
    </div>
  );
}

function CompareSkeleton() {
  return (
    <>
      <ControlsSkeleton />
      <div className={styles.compareRiders}>
        <PanelSkeleton compact />
        <span className={`${styles.skeleton} ${styles.versusSkeleton}`} />
        <PanelSkeleton compact />
      </div>
      <div className={styles.twoColumn}>
        <PanelSkeleton compact />
        <PanelSkeleton compact />
      </div>
    </>
  );
}

function DetailsSkeleton() {
  return (
    <>
      <div className={styles.tabsSkeleton}>
        {Array.from({ length: 4 }, (_, index) => (
          <span
            className={`${styles.skeleton} ${styles.tabSkeleton}`}
            key={index}
          />
        ))}
      </div>
      <ControlsSkeleton />
      <div className={styles.twoColumn}>
        <PanelSkeleton />
        <PanelSkeleton />
      </div>
    </>
  );
}

function RoundDetailsSkeleton() {
  return (
    <>
      <ControlsSkeleton />
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={`${styles.skeleton} ${styles.panelTitle}`} />
          <span className={`${styles.skeleton} ${styles.panelDescription}`} />
        </div>
        <div className={styles.tableHeaderSkeleton}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={styles.skeleton} key={index} />
          ))}
        </div>
        <div className={styles.rows}>
          {Array.from({ length: 7 }, (_, index) => (
            <span className={styles.skeleton} key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

function InfoSkeleton() {
  return (
    <div className={styles.infoSections}>
      {Array.from({ length: 4 }, (_, index) => (
        <div className={styles.infoSection} key={index}>
          <span className={`${styles.skeleton} ${styles.infoTitle}`} />
          <div>
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText || error.data}`
    : error instanceof Error
      ? error.message
      : "An unexpected route error occurred.";

  return (
    <PageContainer>
      <PageHeader title="Page Error" eyebrow="Route boundary" />
      <Section>
        <ErrorState
          message={message}
          onRetry={() => window.location.reload()}
        />
      </Section>
    </PageContainer>
  );
}

export function NotFoundPage() {
  usePageMeta(pageMeta.notFound);
  const navigate = useNavigate();

  return (
    <PageContainer className={styles.notFoundPage}>
      <Section className={styles.notFoundSection}>
        <TableFeedbackState
          type="error"
          label="Route not found"
          description="This route doesn’t exist."
          retryLabel="Return"
          onRetry={() => navigate(routes.home)}
        />
      </Section>
    </PageContainer>
  );
}
