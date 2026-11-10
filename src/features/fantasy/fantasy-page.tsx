import { useState } from "react";
import {
  DataTable,
  DataTableHeader,
  DataTableRow,
  SortableTableHeader,
  type SortDirection,
} from "../../components/data-display/data-table";
import { RiderCell } from "../../components/data-display/rider-cell";
import { Dialog, ModalFooter } from "../../components/overlays/dialog";
import { TableFeedbackState } from "../../components/feedback/states";
import { UpdateProgress } from "../../components/feedback/update-progress";
import {
  PageContainer,
  PageHeader,
  Section,
} from "../../components/layout/page-container";
import { SegmentedControl } from "../../components/navigation/segmented-control";
import { Pagination } from "../../components/navigation/pagination";
import { AppTooltip } from "../../components/overlays/tooltip";
import { Button } from "../../components/ui/button";
import { Panel, SummaryBanner } from "../../components/ui/panel";
import { GLOBAL_PAGE_SIZE } from "../../config/pagination";
import {
  useFantasyCurrent,
  useFantasyRules,
  type FantasyRider,
} from "./api/get-fantasy";
import {
  fantasyDate,
  fantasyMoney,
  fantasyNumber,
  fantasyValue,
  sortFantasyRiders,
  type FantasySort,
} from "./fantasy-format";
import { FantasyRulesDialog } from "./fantasy-rules-dialog";
import styles from "./fantasy-page.module.css";
import failedIcon from "../../assets/icons/failed.png";
import { pageMeta } from "../../config/seo";
import { usePageMeta } from "../../hooks/use-page-meta";

function FantasyIdentity({
  rider,
  teamNumber,
}: {
  rider: FantasyRider;
  teamNumber?: number;
}) {
  const warnings = rider.warnings;
  const recommended = rider.isRecommended;
  const checkStatus = warnings.length > 0;
  const status =
    rider.entryStatus === "not_entered"
      ? "Not entered"
      : recommended
        ? "Recommended"
        : rider.entryStatus === "entered"
          ? "Entered"
          : checkStatus
            ? "Check status"
            : "Entry unknown";
  const statusTone =
    rider.entryStatus === "not_entered"
      ? "excluded"
      : recommended || rider.entryStatus === "entered"
        ? "recommended"
        : checkStatus
          ? "warning"
          : "neutral";
  const badge = (
    <span
      className={styles.identityStatus}
      data-status={statusTone}
      tabIndex={warnings.length ? 0 : undefined}
    >
      {status}
    </span>
  );
  return (
    <div className={styles.riderIdentity}>
      {teamNumber !== undefined ? (
        <span
          className={styles.teamNumber}
          aria-label={`Team rider ${teamNumber}`}
        >
          {teamNumber}
        </span>
      ) : null}
      <div className={styles.identity}>
        <RiderCell
          compact
          showTeam={false}
          linked={rider.riderId !== null}
          rider={{
            id: rider.riderId ?? rider.pinkbikeExternalId,
            name: rider.name,
            country: rider.countryCode,
            category: null,
            profileImageUrl: null,
            team: null,
          }}
        />
        {warnings.length ? (
          <AppTooltip content={warnings.join(" · ")}>{badge}</AppTooltip>
        ) : (
          badge
        )}
      </div>
    </div>
  );
}

function Projection({ rider }: { rider: FantasyRider }) {
  return (
    <AppTooltip
      content={
        <div className={styles.tooltipDetails}>
          <span>Final: {fantasyNumber(rider.expectedFinalPoints)} pts</span>
          <span>Q1 bonus: {fantasyNumber(rider.expectedQ1Bonus)} pts</span>
          <span>
            Evidence confidence: {fantasyNumber(rider.confidence)}
            {rider.confidence === null ? "" : "%"}
          </span>
          <span>
            Pinkbike season total: {fantasyNumber(rider.pinkbikeSeasonPoints)}{" "}
            pts
          </span>
        </div>
      }
    >
      <span tabIndex={0}>{fantasyNumber(rider.expectedFantasyPoints)}</span>
    </AppTooltip>
  );
}

export default function FantasyPage() {
  usePageMeta(pageMeta.fantasy);
  const query = useFantasyCurrent();
  const rulesQuery = useFantasyRules();
  const [activeDialog, setActiveDialog] = useState<"rules" | "guide" | null>(
    null,
  );
  const [gender, setGender] = useState<"male" | "female">("male");
  const [sort, setSort] = useState<FantasySort>("expectedFantasyPoints");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const data = query.data;
  const team = data?.recommendation;
  const riders = sortFantasyRiders(
    data?.riders.filter((rider) => rider.gender === gender) ?? [],
    sort,
    direction,
  );
  const totalPages = Math.max(1, Math.ceil(riders.length / GLOBAL_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRiders = riders.slice(
    (currentPage - 1) * GLOBAL_PAGE_SIZE,
    currentPage * GLOBAL_PAGE_SIZE,
  );
  const refreshing = query.isFetching && data !== undefined;
  const onSort = (next: FantasySort) => {
    setDirection(
      next === sort ? (direction === "asc" ? "desc" : "asc") : "desc",
    );
    setSort(next);
    setPage(1);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Fantasy"
        eyebrow="Pinkbike DH // Expected points // Team optimizer"
        description="Find a legal team for the next round using current rider prices and Race Trace MTB predictions. Projected points are estimates, not guaranteed results."
      />
      {!data ? (
        <Section>
          <TableFeedbackState
            type={
              query.isFetching ? "loading" : query.isError ? "error" : "empty"
            }
            onRetry={() => void query.refetch()}
          />
        </Section>
      ) : (
        <div className={styles.contentStage} aria-busy={refreshing}>
          {refreshing ? (
            <UpdateProgress
              className={styles.updateProgress}
              label="Updating fantasy data"
            />
          ) : null}
          <div
            className={`${styles.content} ${refreshing ? styles.updating : ""}`}
          >
            {query.isError ? (
              <p className={styles.warning} role="status">
                <img src={failedIcon} alt="" aria-hidden="true" />
                <span>
                  Refresh failed. Showing the last successfully loaded data.
                </span>
              </p>
            ) : null}
            <Section aria-label="Best team for next round">
              <Panel padding="none" className={styles.panel}>
                <header className={styles.panelHeader}>
                  <div className={styles.headerCopy}>
                    <h2 className={styles.panelTitle}>Best Team</h2>
                    <p className={styles.panelDescription}>
                      {data.round
                        ? `${data.round.venue ?? "--"} · ${fantasyDate(data.round.startDate)}`
                        : "Next round"}
                    </p>
                  </div>
                  <div className={styles.headerMetrics}>
                    <span>
                      Projected Points{" "}
                      <span className={styles.points}>
                        {fantasyNumber(team?.expectedFantasyPoints)}
                      </span>
                    </span>
                    <i className={styles.metricDot} aria-hidden="true" />
                    <span>
                      {fantasyMoney(team?.totalPrice ?? null)} /{" "}
                      {fantasyMoney(rulesQuery.data?.budget)} Used
                    </span>
                  </div>
                </header>
                {team ? (
                  <>
                    <div className={styles.teamPanels}>
                      {[...team.riders]
                        .sort(
                          (a, b) =>
                            Number(a.gender === "female") -
                            Number(b.gender === "female"),
                        )
                        .map((rider, index) => (
                          <article
                            className={styles.teamRider}
                            key={rider.pinkbikeExternalId}
                            aria-label={`Team rider ${index + 1}: ${rider.name}`}
                          >
                            <FantasyIdentity
                              rider={rider}
                              teamNumber={index + 1}
                            />
                            <dl className={styles.teamMetrics}>
                              <div>
                                <dt>Price</dt>
                                <dd>{fantasyMoney(rider.price)}</dd>
                              </div>
                              <div>
                                <dt>Category</dt>
                                <dd>
                                  {rider.gender === "male"
                                    ? "Men Elite"
                                    : rider.gender === "female"
                                      ? "Women Elite"
                                      : "--"}
                                </dd>
                              </div>
                              <div>
                                <dt>Projected Points</dt>
                                <dd className={styles.points}>
                                  <Projection rider={rider} />
                                </dd>
                              </div>
                            </dl>
                          </article>
                        ))}
                    </div>
                  </>
                ) : (
                  <TableFeedbackState
                    type="empty"
                    label={
                      data.round
                        ? "No eligible team available"
                        : "No upcoming round"
                    }
                    description={
                      data.round
                        ? "Prices or predictions are not available yet."
                        : "Waiting for the next round."
                    }
                  />
                )}
              </Panel>
            </Section>
            <Section aria-label="Fantasy riders">
              <SummaryBanner>{`${gender === "male" ? "Men Elite" : "Women Elite"} · ${fantasyMoney(rulesQuery.data?.budget)} Price pool · ${rulesQuery.data ? (gender === "male" ? rulesQuery.data.men : rulesQuery.data.women) : "--"} Team slots · ${riders.length} Riders`}</SummaryBanner>
              <div className={styles.actions}>
                <SegmentedControl
                  label="Fantasy category"
                  value={gender}
                  options={[
                    { value: "male", label: "Men Elite", tooltip: "Men Elite" },
                    {
                      value: "female",
                      label: "Women Elite",
                      tooltip: "Women Elite",
                    },
                  ]}
                  onChange={(next) => {
                    setGender(next);
                    setPage(1);
                  }}
                />
                <Button
                  className={styles.rulesButton}
                  onClick={() => setActiveDialog("rules")}
                >
                  Rules
                </Button>
                <Button
                  className={styles.rulesButton}
                  onClick={() => setActiveDialog("guide")}
                >
                  How It Works
                </Button>
              </div>
              <Panel padding="none" className={styles.panel}>
                <header className={styles.panelHeader}>
                  <div className={styles.headerCopy}>
                    <h2 className={styles.panelTitle}>Rider Projections</h2>
                    <p className={styles.panelDescription}>
                      Expected points for the next round
                    </p>
                  </div>
                </header>
                {riders.length === 0 ? (
                  <TableFeedbackState
                    type="empty"
                    description="No imported Fantasy riders are available in this category."
                  />
                ) : (
                  <DataTable
                    embedded
                    className={styles.table}
                    aria-label="Fantasy rider projections"
                  >
                    <DataTableHeader>
                      <tr>
                        <th scope="col" data-column="rider">
                          Rider
                        </th>
                        <SortableTableHeader
                          label="Price"
                          sortKey="price"
                          activeSort={sort}
                          direction={direction}
                          onSort={onSort}
                        />
                        <SortableTableHeader
                          label="Projected Points"
                          sortKey="expectedFantasyPoints"
                          activeSort={sort}
                          direction={direction}
                          onSort={onSort}
                        />
                        <SortableTableHeader
                          label={
                            <AppTooltip content="Expected points per $100,000. Informational only; the team is selected by exact budget optimization.">
                              <span>Value</span>
                            </AppTooltip>
                          }
                          sortKey="value"
                          activeSort={sort}
                          direction={direction}
                          onSort={onSort}
                        />
                      </tr>
                    </DataTableHeader>
                    <tbody>
                      {visibleRiders.map((rider) => (
                        <DataTableRow key={rider.pinkbikeExternalId}>
                          <td data-label="Rider" data-column="rider">
                            <FantasyIdentity rider={rider} />
                          </td>
                          <td data-label="Price">
                            {fantasyMoney(rider.price)}
                          </td>
                          <td
                            data-label="Projected Points"
                            className={styles.points}
                          >
                            <Projection rider={rider} />
                          </td>
                          <td data-label="Value / $100k">
                            {fantasyNumber(fantasyValue(rider))}
                          </td>
                        </DataTableRow>
                      ))}
                    </tbody>
                  </DataTable>
                )}
              </Panel>
              {riders.length > GLOBAL_PAGE_SIZE ? (
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  pageSize={GLOBAL_PAGE_SIZE}
                  onPageChange={setPage}
                />
              ) : null}
            </Section>
            <p className={styles.note}>
              Prices updated: {fantasyDate(data.fetchedAtUtc)} ·{" "}
              <a href={data.sourceUrl} target="_blank" rel="noreferrer">
                Pinkbike Fantasy
              </a>
            </p>
          </div>
        </div>
      )}
      {activeDialog === "rules" ? (
        <FantasyRulesDialog open onClose={() => setActiveDialog(null)} />
      ) : null}
      {activeDialog === "guide" ? (
        <Dialog
          className={styles.rulesDialog}
          open
          title="How It Works"
          onClose={() => setActiveDialog(null)}
        >
          <div className={styles.rulesBody}>
            <dl className={styles.guide}>
              <div>
                <dt>Best Team</dt>
                <dd>
                  The combination of four men and two women with the highest
                  total projected points within the budget. Confirmed
                  non-entries and riders with missing prices or predictions are
                  excluded. Unknown entry status does not exclude a rider.
                </dd>
              </div>
              <div>
                <dt>Projected Points</dt>
                <dd>
                  Expected Fantasy points in the next round: final placement
                  points plus the Q1 bonus. These are probability-weighted
                  estimates, not guaranteed results or season totals.
                </dd>
              </div>
              <div>
                <dt>Value</dt>
                <dd>
                  Projected points per $100,000 of rider price. For example, 200
                  points at $250,000 gives a Value of 80.0. A higher Value means
                  more expected points for the price; Best Team optimizes total
                  points, not Value alone.
                </dd>
              </div>
              <div>
                <dt>Price Pool &amp; Team Slots</dt>
                <dd>
                  Price Pool is the budget for the entire six-rider team. Team
                  Slots is the number of riders required from the selected
                  category.
                </dd>
              </div>
              <div>
                <dt>Data &amp; Availability</dt>
                <dd>
                  Prices come from the latest successful Pinkbike import. Entry
                  status describes confirmed participation in this round only,
                  not readiness to race. Without current entry evidence it
                  remains unknown. A dash means data is unavailable.
                </dd>
              </div>
            </dl>
          </div>
          <ModalFooter>
            <Button onClick={() => setActiveDialog(null)}>Close</Button>
          </ModalFooter>
        </Dialog>
      ) : null}
    </PageContainer>
  );
}
