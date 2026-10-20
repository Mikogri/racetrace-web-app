import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PrivacyPolicyPage from './privacy-policy-page'

describe('Privacy Policy', () => {
  it('renders the policy and usable contact links instead of an empty state', () => {
    render(<PrivacyPolicyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(8)
    for (const link of screen.getAllByRole('link', { name: 'contact@racetracemtb.com' })) {
      expect(link).toHaveAttribute('href', 'mailto:contact@racetracemtb.com')
    }
    expect(screen.getByRole('link', { name: 'UODO' })).toHaveAttribute('href', 'https://uodo.gov.pl/')
    expect(screen.queryByText('No content available')).not.toBeInTheDocument()
  })

  it('identifies the controller without presenting unconfirmed retention as a published policy', () => {
    render(<PrivacyPolicyPage />)
    expect(screen.getByRole('note')).toHaveTextContent('Draft — not yet an effective privacy notice')
    expect(screen.getByText(/The data controller is Mikołaj Grigoriew, based in Poland/)).toBeVisible()
    expect(screen.getByText(/Specific retention periods for logs, correspondence and backups are awaiting confirmation/)).toBeVisible()
  })
})
