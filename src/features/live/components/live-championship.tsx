import { Panel, PanelHeader } from '../../../components/ui/panel';
import { TableFeedbackState } from '../../../components/feedback/states';
import type { LiveSession } from '../api/get-live';
import { useLiveChampionship, type championshipSession } from '../api/live-championship';
import { normalizeDisplayName } from '../../../utils/display-name';
import styles from './live-championship.module.css';

const labels = {
  open: 'Title still open',
  secured: 'Title mathematically secured',
  decided: 'Title decided on current results',
  tied: 'Level on points · tie-break confirmation needed',
  incomplete: 'Incomplete timing data · title not confirmed',
  unavailable: 'Championship projection unavailable',
};

export function LiveChampionship({ session, catalog, snapshot }: { session: LiveSession; catalog: LiveSession[]; snapshot: Parameters<typeof championshipSession>[1] }) {
  const query = useLiveChampionship(session, catalog, snapshot);
  if (!query.eligible) return null;
  return (
    <Panel className={styles.panel}>
      <PanelHeader title="Championship Live" description="Provisional overall standings · season finale" />
      {query.loading ? <TableFeedbackState type="loading" /> : null}
      {query.error && !query.data ? <TableFeedbackState type="error" onRetry={query.retry} /> : null}
      {!query.loading && !query.error && !query.data?.items.length ? (
        <TableFeedbackState type="empty" label="Championship data unavailable" description="Complete standings and scoring data are needed for this projection." />
      ) : null}
      {query.data && query.data.items.length > 0 ? <>
        <ol className={styles.riders}>
          {query.data.items.map((rider, index) => <li key={rider.uciId}>
            <span className={styles.position}>{query.data?.lead === 0 ? '=' : index + 1}</span>
            <span className={styles.name}>{normalizeDisplayName(rider.name)}</span>
            <strong>{rider.points} <small>pts</small></strong>
          </li>)}
        </ol>
        <div className={styles.summary}>
          <span>{query.data.lead === null ? 'Lead unavailable' : `${query.data.lead} pts lead`}</span>
          <span className={!query.error && query.data.canChange === false ? styles.secured : undefined}>
            {query.error ? 'Update failed · showing previous standings' : labels[query.data.status]}
          </span>
        </div>
      </> : null}
    </Panel>
  );
}
