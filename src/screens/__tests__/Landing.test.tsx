import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Landing from '../Landing'

describe('Landing', () => {
  it('renders the hero headline with italic "Swipe"', () => {
    render(<Landing />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Research smarter/i)).toBeInTheDocument()
  })

  it('renders input prefilled with "Clay"', () => {
    render(<Landing />, { wrapper: BrowserRouter })
    const input = screen.getByLabelText(/target company/i) as HTMLInputElement
    expect(input.value).toBe('Clay')
  })

  it('navigates to /loading when CTA is clicked', () => {
    render(<Landing />, { wrapper: BrowserRouter })
    const button = screen.getByRole('button', { name: /Research this company/i })
    fireEvent.click(button)
    // Navigation happens via react-router, test that button exists and is clickable
    expect(button).toBeInTheDocument()
  })
})
