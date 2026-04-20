import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import EyebrowLabel from '../components/EyebrowLabel'
import CardStack from '../components/CardStack'
import CorrectionRow from '../components/CorrectionRow'
import LearnedCounter from '../components/LearnedCounter'
import useLearnedCounter from '../hooks/useLearnedCounter'
import { clayCards } from '../data/clayCards'
import './SwipeStack.css'

export default function SwipeStack() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCorrectionRow, setShowCorrectionRow] = useState(false)
  const [approvedCards, setApprovedCards] = useState<number[]>([])
  const [flaggedCards, setFlaggedCards] = useState<number[]>([])
  const { count, increment } = useLearnedCounter()
  const [counterAnimating, setCounterAnimating] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCorrectionRow) return

      if (e.key === 'ArrowRight') {
        handleApprove(clayCards[currentIndex].id)
      } else if (e.key === 'ArrowLeft') {
        handleFlag(clayCards[currentIndex].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, showCorrectionRow])

  const handleApprove = (cardId: number) => {
    setApprovedCards(prev => [...prev, cardId])
    advanceCard()
  }

  const handleFlag = (cardId: number) => {
    setFlaggedCards(prev => [...prev, cardId])
    setShowCorrectionRow(true)
  }

  const handleCorrectionSave = (_text: string) => {
    increment()
    triggerCounterAnimation()
    setShowCorrectionRow(false)
    advanceCard()
  }

  const handleCorrectionSkip = () => {
    increment()
    triggerCounterAnimation()
    setShowCorrectionRow(false)
    advanceCard()
  }

  const advanceCard = () => {
    if (currentIndex + 1 >= clayCards.length) {
      // Navigate to email after delay
      setTimeout(() => {
        navigate('/email', {
          state: {
            approvedCards,
            flaggedCards,
            learnedCount: count,
          }
        })
      }, 500)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const triggerCounterAnimation = () => {
    setCounterAnimating(true)
    setTimeout(() => setCounterAnimating(false), 200)
  }

  const progress = `${String(currentIndex + 1).padStart(2, '0')} / ${String(clayCards.length).padStart(2, '0')}`

  return (
    <div className="swipe-stack-screen page-transition">
      <Sidebar
        footer={
          <LearnedCounter count={count} animating={counterAnimating} />
        }
      >
        <div className="swipe-stack__meta">
          <EyebrowLabel>target</EyebrowLabel>
          <div className="swipe-stack__meta-value">Clay</div>
        </div>

        <div className="swipe-stack__meta">
          <EyebrowLabel>progress</EyebrowLabel>
          <div className="swipe-stack__meta-value">{progress}</div>
        </div>

        <div className="swipe-stack__keyboard-hints">
          <div className="swipe-stack__hint">
            <span className="swipe-stack__key">→</span> Good signal
          </div>
          <div className="swipe-stack__hint">
            <span className="swipe-stack__key">←</span> Worth a second look
          </div>
        </div>
      </Sidebar>

      <main className="swipe-stack__main">
        <div className="swipe-stack__stage">
          <CardStack
            cards={clayCards}
            currentIndex={currentIndex}
            onApprove={handleApprove}
            onFlag={handleFlag}
          />

          {showCorrectionRow ? (
            <CorrectionRow
              onSave={handleCorrectionSave}
              onSkip={handleCorrectionSkip}
            />
          ) : (
            <div className="swipe-stack__buttons">
              <button
                className="swipe-stack__action-button"
                onClick={() => handleFlag(clayCards[currentIndex].id)}
              >
                ✗
              </button>
              <button
                className="swipe-stack__action-button"
                onClick={() => handleApprove(clayCards[currentIndex].id)}
              >
                ✓
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
