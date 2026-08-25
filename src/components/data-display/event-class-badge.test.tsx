import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventClassBadge } from './event-class-badge'

describe('EventClassBadge', () => {
  it('uses domain labels for competition classes', () => {
    const { rerender } = render(<EventClassBadge eventClass="world-cup" />)
    expect(screen.getByText('WC')).toBeInTheDocument()
    rerender(<EventClassBadge eventClass="world-championship" />)
    expect(screen.getByText('WCH')).toBeInTheDocument()
  })
})
