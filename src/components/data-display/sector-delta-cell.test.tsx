import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectorDeltaCell } from './sector-delta-cell'

describe('SectorDeltaCell', () => {
  it('renders gain, loss and missing states with text', () => {
    const { rerender } = render(<SectorDeltaCell value={-0.314} />)
    expect(screen.getByText('-0.314')).toHaveAttribute('data-state', 'gain')

    rerender(<SectorDeltaCell value={0.314} />)
    expect(screen.getByText('+0.314')).toHaveAttribute('data-state', 'loss')

    rerender(<SectorDeltaCell value={null} />)
    expect(screen.getByText('—')).toHaveAttribute('data-state', 'missing')
  })

  it('labels incidents independently from the numeric value', () => {
    render(<SectorDeltaCell value={-2} incident />)
    expect(screen.getByText('Incident')).toHaveAttribute('data-state', 'incident')
  })
})
