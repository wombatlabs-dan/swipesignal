import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Sidebar from '../Sidebar'

describe('Sidebar', () => {
  it('renders corner mark', () => {
    render(<Sidebar />)
    expect(screen.getByText(/SwipeSignal/i)).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Sidebar>
        <div>Test content</div>
      </Sidebar>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<Sidebar footer={<div>Footer content</div>} />)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })
})
