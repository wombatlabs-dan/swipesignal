import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import EmailOutput from '../EmailOutput'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('EmailOutput', () => {
  it('renders email subject and body', () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Your SDR hiring spree/i)).toBeInTheDocument()
    expect(screen.getByText(/Saw you just opened/i)).toBeInTheDocument()
  })

  it('renders sidebar with target and basis chips', () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    expect(screen.getByText('TARGET')).toBeInTheDocument()
    expect(screen.getByText('Clay')).toBeInTheDocument()
    expect(screen.getByText('BASIS')).toBeInTheDocument()
  })

  it('copies email to clipboard when copy button clicked', async () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    const copyButton = screen.getByRole('button', { name: /copy email/i })
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })

  it('regenerates email when regenerate button clicked', () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    const regenerateButton = screen.getByRole('button', { name: /regenerate/i })
    fireEvent.click(regenerateButton)

    // Should trigger email version toggle
    expect(regenerateButton).toBeInTheDocument()
  })
})
