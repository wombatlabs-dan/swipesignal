import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card from '../Card'
import { CardData } from '../../data/clayCards'

const mockCard: CardData = {
  id: 1,
  source: 'FROM JOB POSTINGS',
  insight: 'Test insight text',
  confidence: 'High confidence',
}

describe('Card', () => {
  it('renders card with source, insight, and confidence', () => {
    render(<Card card={mockCard} />)
    expect(screen.getByText('FROM JOB POSTINGS')).toBeInTheDocument()
    expect(screen.getByText('Test insight text')).toBeInTheDocument()
    expect(screen.getByText(/High confidence/i)).toBeInTheDocument()
  })

  it('applies green dot for high confidence', () => {
    const { container } = render(<Card card={mockCard} />)
    const dot = container.querySelector('.card__confidence-dot')
    expect(dot).toHaveStyle({ background: 'var(--color-approve)' })
  })

  it('applies amber dot for moderate confidence', () => {
    const moderateCard = { ...mockCard, confidence: 'Moderate - verify this' as const }
    const { container } = render(<Card card={moderateCard} />)
    const dot = container.querySelector('.card__confidence-dot')
    expect(dot).toHaveStyle({ background: 'var(--color-flag)' })
  })
})
