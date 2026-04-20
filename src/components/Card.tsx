import { CardData } from '../data/clayCards'
import './Card.css'

interface CardProps {
  card: CardData
  x?: number
  tilt?: number
  glowOpacity?: number
  isDragging?: boolean
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerMove?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
}

export default function Card({
  card,
  x = 0,
  tilt = 0,
  glowOpacity = 0,
  isDragging = false,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: CardProps) {
  const confidenceDotColor = card.confidence === 'High confidence'
    ? 'var(--color-approve)'
    : 'var(--color-flag)'

  const showApproveGhost = x > 40
  const showFlagGhost = x < -40

  return (
    <div
      className={`card ${isDragging ? 'card--dragging' : ''}`}
      style={{
        transform: `translateX(${x}px) rotate(${tilt}deg)`,
        transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Approve glow */}
      {showApproveGhost && (
        <>
          <div
            className="card__glow card__glow--approve"
            style={{ opacity: glowOpacity }}
          />
          <div
            className="card__ghost-label card__ghost-label--approve"
            style={{ opacity: Math.min(glowOpacity * 1.2, 0.85) }}
          >
            Good signal
          </div>
        </>
      )}

      {/* Flag glow */}
      {showFlagGhost && (
        <>
          <div
            className="card__glow card__glow--flag"
            style={{ opacity: glowOpacity }}
          />
          <div
            className="card__ghost-label card__ghost-label--flag"
            style={{ opacity: Math.min(glowOpacity * 1.2, 0.85) }}
          >
            Worth a second look
          </div>
        </>
      )}

      <div className="card__content">
        <div className="card__source">{card.source}</div>

        <div className="card__insight">{card.insight}</div>

        <div className="card__confidence">
          <span
            className="card__confidence-dot"
            style={{ background: confidenceDotColor }}
          />
          <span className="card__confidence-text">{card.confidence}</span>
        </div>
      </div>
    </div>
  )
}
