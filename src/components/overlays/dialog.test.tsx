import { createRef } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Dialog, ModalFooter } from './dialog'

let frame: FrameRequestCallback | undefined

beforeEach(() => {
  frame = undefined
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frame = callback
    return 1
  })
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
  vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1008)
})

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
  vi.restoreAllMocks()
})

function flushFocusFrame() {
  act(() => frame?.(0))
}

describe('Dialog', () => {
  it('renders the same portal, header, footer and accessibility attributes', () => {
    render(
      <Dialog open title="Select Rider" onClose={vi.fn()} className="custom-dialog">
        <input aria-label="Search" />
        <ModalFooter><button type="button">Confirm</button></ModalFooter>
      </Dialog>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Select Rider' })
    const backdrop = dialog.parentElement!
    // React IDs are unique per render; normalize only this generated identifier.
    const titleId = dialog.getAttribute('aria-labelledby')!
    expect(backdrop.outerHTML.replaceAll(titleId, 'dialog-title')).toMatchSnapshot()
    expect(backdrop.parentElement).toBe(document.body)
  })

  it('renders nothing and does not lock scrolling while closed', () => {
    render(<Dialog open={false} title="Select Rider" onClose={vi.fn()}>Content</Dialog>)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('focuses the requested input once without resetting focus on rerender', () => {
    const inputRef = createRef<HTMLInputElement>()
    const content = (title: string) => (
      <Dialog open title={title} onClose={vi.fn()} initialFocusRef={inputRef}>
        <input ref={inputRef} aria-label="Search" />
        <button type="button">Confirm</button>
      </Dialog>
    )
    const { rerender } = render(content('Select Rider'))
    flushFocusFrame()
    expect(screen.getByRole('textbox')).toHaveFocus()

    screen.getByRole('button', { name: 'Confirm' }).focus()
    rerender(content('Change Rider'))
    expect(screen.getByRole('dialog', { name: 'Change Rider' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus()
    expect(window.requestAnimationFrame).toHaveBeenCalledOnce()
  })

  it('falls back to the first control and loops Tab in both directions, skipping disabled controls', () => {
    render(
      <Dialog open title="Select Rider" onClose={vi.fn()}>
        <input aria-label="Search" />
        <button type="button">Confirm</button>
        <button type="button" disabled>Disabled</button>
      </Dialog>,
    )
    flushFocusFrame()
    const first = screen.getByRole('button', { name: 'Close dialog' })
    const last = screen.getByRole('button', { name: 'Confirm' })
    expect(first).toHaveFocus()

    expect(fireEvent.keyDown(first, { key: 'Tab', shiftKey: true })).toBe(false)
    expect(last).toHaveFocus()
    expect(fireEvent.keyDown(last, { key: 'Tab' })).toBe(false)
    expect(first).toHaveFocus()
    expect(fireEvent.keyDown(first, { key: 'Tab' })).toBe(true)
  })

  it('closes on Escape or the close button, but not ordinary keys', () => {
    const onClose = vi.fn()
    render(<Dialog open title="Select Rider" onClose={onClose}><input aria-label="Search" /></Dialog>)
    const input = screen.getByRole('textbox')

    expect(fireEvent.keyDown(input, { key: 'ArrowDown' })).toBe(true)
    expect(onClose).not.toHaveBeenCalled()
    expect(fireEvent.keyDown(input, { key: 'Escape' })).toBe(false)
    expect(onClose).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it.each([true, false])('respects closeOnBackdrop=%s and ignores clicks inside', (closeOnBackdrop) => {
    const onClose = vi.fn()
    render(<Dialog open title="Select Rider" onClose={onClose} closeOnBackdrop={closeOnBackdrop}>Content</Dialog>)
    const dialog = screen.getByRole('dialog')

    fireEvent.mouseDown(dialog)
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.mouseDown(dialog.parentElement!)
    expect(onClose).toHaveBeenCalledTimes(closeOnBackdrop ? 1 : 0)
  })

  it.each(['close', 'unmount'])('restores focus and original body styles on %s', (action) => {
    document.body.style.overflow = 'auto'
    document.body.style.paddingRight = '4px'
    const onClose = vi.fn()
    const { rerender, unmount } = render(
      <><button type="button">Open</button><Dialog open={false} title="Select Rider" onClose={onClose}>Content</Dialog></>,
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    trigger.focus()
    rerender(<><button type="button">Open</button><Dialog open title="Select Rider" onClose={onClose}>Content</Dialog></>)
    flushFocusFrame()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.paddingRight).toBe('20px')

    if (action === 'close') {
      rerender(<><button type="button">Open</button><Dialog open={false} title="Select Rider" onClose={onClose}>Content</Dialog></>)
      expect(trigger).toHaveFocus()
    } else {
      const restoreFocus = vi.spyOn(trigger, 'focus')
      unmount()
      expect(restoreFocus).toHaveBeenCalledOnce()
    }
    expect(document.body.style.overflow).toBe('auto')
    expect(document.body.style.paddingRight).toBe('4px')
  })
})
