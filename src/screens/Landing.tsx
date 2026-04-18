import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerMark } from '../components/CornerMark'
import EyebrowLabel from '../components/EyebrowLabel'
import Button from '../components/Button'
import './Landing.css'

export default function Landing() {
  const [company, setCompany] = useState('Clay')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/loading')
  }

  return (
    <div className="landing">
      <div className="landing__corner">
        <CornerMark />
      </div>

      <div className="landing__hero">
        <EyebrowLabel>research · synthesize · swipe</EyebrowLabel>

        <h1 className="landing__headline">
          Research smarter. <em className="landing__headline-swipe">Swipe</em> to confirm. Send with confidence.
        </h1>

        <p className="landing__subline">
          Drop a company name. We'll do the homework.
        </p>

        <div className="landing__divider" />

        <form onSubmit={handleSubmit} className="landing__form">
          <label htmlFor="company-input">
            <EyebrowLabel>target company</EyebrowLabel>
          </label>

          <input
            id="company-input"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="landing__input"
          />

          <Button type="submit">
            Research this company →
          </Button>
        </form>
      </div>
    </div>
  )
}
