import { DataTable, DataTableHeader, DataTableRow } from '../../components/data-display/data-table'
import { TableFeedbackState } from '../../components/feedback/states'
import { Dialog, ModalFooter } from '../../components/overlays/dialog'
import { Button } from '../../components/ui/button'
import { SummaryBanner } from '../../components/ui/panel'
import { useFantasyRules } from './api/get-fantasy'
import { fantasyMoney } from './fantasy-format'
import styles from './fantasy-page.module.css'

export function FantasyRulesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const query = useFantasyRules()
  const rules = query.data
  return <Dialog className={styles.rulesDialog} open={open} title={rules ? `Fantasy Rules · ${rules.season}` : 'Fantasy Rules'} onClose={onClose}>
    <div className={styles.rulesBody}>
      {!rules ? <TableFeedbackState type={query.isFetching ? 'loading' : 'error'} onRetry={() => void query.refetch()} /> : <>
        <SummaryBanner>{`${fantasyMoney(rules.budget)} Budget · ${rules.teamSize} Riders · ${rules.men} Men · ${rules.women} Women`}</SummaryBanner>
        <h3 className={styles.smallTitle}>Final placement points</h3>
        <DataTable className={styles.rulesTable} aria-label="Final placement points">
          <DataTableHeader><tr><th scope="col">Position</th><th scope="col">Men</th><th scope="col">Women</th></tr></DataTableHeader>
          <tbody>{rules.finalPlacementPoints.map(row => <DataTableRow key={row.position}><td>{row.position}</td><td>{row.menPoints ?? '--'}</td><td>{row.womenPoints ?? '--'}</td></DataTableRow>)}</tbody>
        </DataTable>
        <h3 className={styles.smallTitle}>Q1 bonus</h3>
        <DataTable className={styles.rulesTable} aria-label="Q1 bonus points">
          <DataTableHeader><tr><th scope="col">Position</th><th scope="col">Bonus</th></tr></DataTableHeader>
          <tbody>{rules.q1Bonus.map(row => <DataTableRow key={row.position}><td>{row.position}</td><td>+{row.points}</td></DataTableRow>)}</tbody>
        </DataTable>
        {rules.dynamicPricing ? <p className={styles.note}>Prices are dynamic and may change after each round. Team selection uses the latest successfully imported prices, not a fixed rider-price ceiling.</p> : null}
        <p className={styles.note}>Projected points are expected values, not guaranteed results. Missing prices or predictions may prevent a recommendation. A confirmed start list is optional; without one, selection uses the Pinkbike catalogue and reported injuries.</p>
        <p className={styles.note}>Rules version: {rules.version} · <a href={rules.sourceUrl} target="_blank" rel="noreferrer">Official source</a></p>
      </>}
    </div>
    <ModalFooter><Button onClick={onClose}>Close</Button></ModalFooter>
  </Dialog>
}
