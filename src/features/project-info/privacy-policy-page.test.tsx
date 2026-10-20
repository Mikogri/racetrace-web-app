import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PrivacyPolicyPage from './privacy-policy-page'

describe('Privacy Policy', () => {
  it('renders the policy and usable contact links instead of an empty state', () => {
    render(<PrivacyPolicyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(8)
    expect(screen.getAllByRole('heading', { level: 2 }).at(-1)).toHaveTextContent('Who is responsible?')
    for (const link of screen.getAllByRole('link', { name: 'contact@racetracemtb.com' })) {
      expect(link).toHaveAttribute('href', 'mailto:contact@racetracemtb.com')
    }
    expect(screen.getByRole('link', { name: 'UODO' })).toHaveAttribute('href', 'https://uodo.gov.pl/')
    expect(screen.queryByText('No content available')).not.toBeInTheDocument()
  })

  it('shows the updated notice without inventing provider retention or self-managed backups', () => {
    render(<PrivacyPolicyPage />)
    expect(screen.queryByText(/Draft — not yet an effective privacy notice/)).not.toBeInTheDocument()
    expect(screen.getByText('20 October 2026')).toHaveAttribute('datetime', '2026-10-20')
    expect(screen.getByText(/The data controller is Mikołaj Grigoriew, based in Poland/)).toBeVisible()
    expect(screen.getByText(/RaceTrace does not maintain separate, self-managed backups/)).toBeVisible()
    expect(screen.getByText(/RaceTrace does not have an in-app messaging system/)).toBeVisible()
    expect(screen.getByText(/The exact production logging settings and retention periods still need to be verified/)).toBeVisible()
  })
})
