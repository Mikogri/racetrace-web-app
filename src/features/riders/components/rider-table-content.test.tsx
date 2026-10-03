import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { RiderTableContent } from './rider-table-content'
import styles from '../rider-pages.module.css'
import feedbackStyles from '../../../components/feedback/states.module.css'

it('keeps table content directly inside the existing styled container', () => {
  const { container } = render(<RiderTableContent hasDataError={false} isEmpty={false} onRetry={() => {}}><table><tbody><tr><td>Rider</td></tr></tbody></table></RiderTableContent>)
  expect(container.firstElementChild).toHaveClass(styles.content, styles.resultsPage)
  expect(screen.getByRole('table').parentElement).toBe(container.firstElementChild)
})

it('prioritizes errors over empty data, preserves retry and disables entrance animation', () => {
  const retry = vi.fn()
  render(<RiderTableContent hasDataError isEmpty onRetry={retry}><p>Table content</p></RiderTableContent>)
  expect(screen.getByRole('alert')).not.toHaveClass(feedbackStyles.enterState)
  expect(screen.queryByText('Table content')).not.toBeInTheDocument()
  expect(screen.queryByText('No data available')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(retry).toHaveBeenCalledOnce()
})

it('shows the unchanged empty state without a retry button or entrance animation', () => {
  render(<RiderTableContent hasDataError={false} isEmpty onRetry={() => {}}><p>Table content</p></RiderTableContent>)
  expect(screen.getByText('No data available')).toBeInTheDocument()
  expect(screen.getByRole('status')).not.toHaveClass(feedbackStyles.enterState)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
  expect(screen.queryByText('Table content')).not.toBeInTheDocument()
})
