import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SelectRiderModal } from './select-rider-modal'

function renderModal(onConfirm = vi.fn(), onClose = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <SelectRiderModal open onClose={onClose} onConfirm={onConfirm} />
    </QueryClientProvider>,
  )
  return { onConfirm, onClose }
}

afterEach(() => vi.unstubAllGlobals())

describe('SelectRiderModal', () => {
  it('requires explicit confirmation of a selected rider', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            items: [
              {
                riderId: 12,
                fullName: 'Loic Bruni',
                teamName: 'Specialized Gravity',
                countryCode: 'FRA',
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    )
    const user = userEvent.setup()
    const { onConfirm } = renderModal()
    const confirmButton = screen.getByRole('button', { name: 'Select Rider' })
    expect(confirmButton).toBeDisabled()

    const rider = await screen.findByRole('option', { name: /loic bruni/i })
    await user.click(rider)
    expect(onConfirm).not.toHaveBeenCalled()
    expect(confirmButton).toBeEnabled()
    await user.click(confirmButton)

    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ id: '12', name: 'Loic Bruni' }),
    )
  })

  it('closes with Escape and restores focus', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
    const user = userEvent.setup()
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.append(trigger)
    trigger.focus()
    const { onClose } = renderModal()

    await waitFor(() => expect(screen.getByPlaceholderText('Search rider by name...')).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })
})
