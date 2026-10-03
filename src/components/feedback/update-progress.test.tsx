import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { UpdateProgress } from './update-progress'

it('preserves the labelled progress element and its animation child', () => {
  const { container } = render(<UpdateProgress className="existing-progress" label="Loading rider data" />)
  const progress = screen.getByRole('progressbar', { name: 'Loading rider data' })
  expect(container.firstElementChild).toBe(progress)
  expect(progress.tagName).toBe('DIV')
  expect(progress).toHaveClass('existing-progress')
  expect(progress.innerHTML).toBe('<span></span>')
})
