import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Loading from '../Loading'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('Loading', () => {
  it('renders sidebar with target metadata', () => {
    render(<Loading />, { wrapper: BrowserRouter })
    expect(screen.getByText('TARGET')).toBeInTheDocument()
    expect(screen.getByText('Clay')).toBeInTheDocument()
  })

  it('renders three loading steps', () => {
    render(<Loading />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Scanning job postings/i)).toBeInTheDocument()
    expect(screen.getByText(/Reading product reviews/i)).toBeInTheDocument()
    expect(screen.getByText(/Synthesizing insights/i)).toBeInTheDocument()
  })

  it('shows first step as active initially', () => {
    const { container } = render(<Loading />, { wrapper: BrowserRouter })
    const firstDot = container.querySelectorAll('.loading-step__dot')[0]
    expect(firstDot).toHaveClass('loading-step__dot--active')
  })
})
