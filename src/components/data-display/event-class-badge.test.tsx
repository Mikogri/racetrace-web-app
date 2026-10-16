import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventClassBadge } from './event-class-badge'

describe('EventClassBadge', () => {
  it('uses domain labels for competition classes', () => {
    const { rerender } = render(<EventClassBadge code="world-cup" abbreviation="WC" />)
    expect(screen.getByText('WC')).toBeInTheDocument()
    rerender(<EventClassBadge code="world-championship" abbreviation="WCH" />)
    expect(screen.getByText('WCH')).toBeInTheDocument()
  })

  it('renders new API classes with their own label and neutral colors', () => {
    render(<EventClassBadge code="continental_championship" abbreviation="CC" name="Continental Championship" />)
    expect(screen.getByText('CC')).toHaveStyle({
      color: 'var(--color-event-class-neutral-text)',
    })
  })
})
