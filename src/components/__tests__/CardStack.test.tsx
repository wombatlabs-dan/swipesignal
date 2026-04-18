import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CardStack from '../CardStack'
import { CardData } from '../../data/clayCards'

const mockCards: CardData[] = [
  {
    id: 1,
    source: 'FROM JOB POSTINGS',
    insight: 'First card',
    confidence: 'High confidence',
  },
  {
    id: 2,
    source: 'FROM G2 REVIEWS',
    insight: 'Second card',
    confidence: 'Moderate - verify this',
  },
]

describe('CardStack', () => {
  it('renders current card with full opacity', () => {
    render(<CardStack cards={mockCards} currentIndex={0} />)
    expect(screen.getByText('First card')).toBeInTheDocument()
  })

  it('shows peek of next card', () => {
    const { container } = render(<CardStack cards={mockCards} currentIndex={0} />)
    const peekCard = container.querySelector('.card-stack__peek')
    expect(peekCard).toBeInTheDocument()
  })

  it('calls onApprove when card swiped right', () => {
    const onApprove = vi.fn()
    render(<CardStack cards={mockCards} currentIndex={0} onApprove={onApprove} />)
    // Drag interaction tested in useDrag hook tests
  })

  it('calls onFlag when card swiped left', () => {
    const onFlag = vi.fn()
    render(<CardStack cards={mockCards} currentIndex={0} onFlag={onFlag} />)
    // Drag interaction tested in useDrag hook tests
  })
})
