import './LearnedCounter.css'

interface LearnedCounterProps {
  count: number
  animating?: boolean
}

export default function LearnedCounter({ count, animating = false }: LearnedCounterProps) {
  const plural = count === 1 ? 'correction' : 'corrections'

  return (
    <div className="learned-counter">
      <span className="learned-counter__text">Learned from </span>
      <span className={`learned-counter__numeral ${animating ? 'learned-counter__numeral--animating' : ''}`}>
        {count}
      </span>
      <span className="learned-counter__text"> {plural}.</span>
    </div>
  )
}
