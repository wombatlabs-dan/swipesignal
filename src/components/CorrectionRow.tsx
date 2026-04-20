import { useState, useEffect } from 'react'
import './CorrectionRow.css'

interface CorrectionRowProps {
  onSave: (text: string) => void
  onSkip: () => void
}

export default function CorrectionRow({ onSave, onSkip }: CorrectionRowProps) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (text.length > 0) return

    const timer = setTimeout(() => {
      onSkip()
    }, 6000)

    return () => clearTimeout(timer)
  }, [onSkip, text])

  const handleSave = () => {
    onSave(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onSkip()
    }
  }

  return (
    <div className="correction-row">
      <div className="correction-row__eyebrow">
        ✗ WHY? (OPTIONAL)
      </div>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="It's old news — they fixed this last quarter"
        className="correction-row__input"
        autoFocus
      />

      <div className="correction-row__buttons">
        <button onClick={onSkip} className="correction-row__button correction-row__button--skip">
          Skip
        </button>
        <button onClick={handleSave} className="correction-row__button correction-row__button--save">
          Save
        </button>
      </div>
    </div>
  )
}
