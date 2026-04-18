import { useState, useEffect } from 'react'
import Card from './Card'
import useDrag from '../hooks/useDrag'
import { CardData } from '../data/clayCards'
import './CardStack.css'

interface CardStackProps {
  cards: CardData[]
  currentIndex: number
  onApprove?: (cardId: number) => void
  onFlag?: (cardId: number) => void
}

export default function CardStack({
  cards,
  currentIndex,
  onApprove,
  onFlag,
}: CardStackProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)

  const currentCard = cards[currentIndex]
  const nextCard = cards[currentIndex + 1]

  const { x, tilt, glowOpacity, isDragging, handlers, reset } = useDrag({
    threshold: 100,
    onSwipeRight: () => {
      setExitDirection('right')
      setIsExiting(true)
    },
    onSwipeLeft: () => {
      setExitDirection('left')
      setIsExiting(true)
    },
  })

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        if (exitDirection === 'right') {
          onApprove?.(currentCard.id)
        } else if (exitDirection === 'left') {
          onFlag?.(currentCard.id)
        }
        setIsExiting(false)
        setExitDirection(null)
        reset()
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isExiting, exitDirection, currentCard, onApprove, onFlag, reset])

  if (!currentCard) return null

  return (
    <div className="card-stack">
      {/* Next card peek */}
      {nextCard && !isExiting && (
        <div className="card-stack__peek">
          <Card card={nextCard} />
        </div>
      )}

      {/* Current card */}
      <div
        className={`card-stack__current ${isExiting ? 'card-stack__current--exiting' : ''}`}
        style={{
          transform: isExiting
            ? `translateX(${exitDirection === 'right' ? '400px' : '-400px'})`
            : undefined,
        }}
      >
        <Card
          card={currentCard}
          x={x}
          tilt={tilt}
          glowOpacity={glowOpacity}
          isDragging={isDragging}
          {...handlers}
        />
      </div>
    </div>
  )
}
