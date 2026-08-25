import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageHeader } from './page-container'

describe('PageHeader', () => {
  it('places double slashes at the start and between caption fragments', () => {
    render(<PageHeader title="Ranking" eyebrow="Performance / Riders / Categories" />)

    const caption = screen.getByText('Performance').parentElement
    expect(caption).toHaveTextContent('//Performance//Riders//Categories')
    expect(caption).not.toHaveTextContent(/Categories\s*\/\//)
    expect(screen.getAllByText('//')).toHaveLength(3)
  })
})
