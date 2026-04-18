import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CorrectionRow from '../CorrectionRow'

describe('CorrectionRow', () => {
  it('renders with eyebrow label and input', () => {
    render(<CorrectionRow onSave={vi.fn()} onSkip={vi.fn()} />)
    expect(screen.getByText(/✗ WHY\? \(OPTIONAL\)/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/It's old news/i)).toBeInTheDocument()
  })

  it('calls onSave with text when Save button clicked', () => {
    const onSave = vi.fn()
    render(<CorrectionRow onSave={onSave} onSkip={vi.fn()} />)

    const input = screen.getByPlaceholderText(/It's old news/i)
    fireEvent.change(input, { target: { value: 'Test correction' } })

    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)

    expect(onSave).toHaveBeenCalledWith('Test correction')
  })

  it('calls onSkip when Skip button clicked', () => {
    const onSkip = vi.fn()
    render(<CorrectionRow onSave={vi.fn()} onSkip={onSkip} />)

    const skipButton = screen.getByRole('button', { name: /skip/i })
    fireEvent.click(skipButton)

    expect(onSkip).toHaveBeenCalled()
  })

  it('calls onSkip after 6 second timeout', async () => {
    vi.useFakeTimers()
    const onSkip = vi.fn()
    render(<CorrectionRow onSave={vi.fn()} onSkip={onSkip} />)

    vi.advanceTimersByTime(6000)
    await waitFor(() => expect(onSkip).toHaveBeenCalled())

    vi.useRealTimers()
  })
})
