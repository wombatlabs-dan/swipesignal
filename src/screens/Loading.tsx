import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import EyebrowLabel from '../components/EyebrowLabel'
import './Loading.css'

type StepStatus = 'pending' | 'active' | 'done'

interface LoadingStep {
  label: string
  status: StepStatus
  duration: number
}

export default function Loading() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const steps: LoadingStep[] = [
    { label: 'Scanning job postings...', status: 'pending', duration: 4000 },
    { label: 'Reading product reviews...', status: 'pending', duration: 4000 },
    { label: 'Synthesizing insights...', status: 'pending', duration: 5000 },
  ]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    let elapsed = 0

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index)

        // Navigate after last step
        if (index === steps.length - 1) {
          setTimeout(() => {
            navigate('/swipe')
          }, step.duration + Math.random() * 1000)
        }
      }, elapsed)

      timers.push(timer)
      elapsed += step.duration + Math.random() * 1000 - 500
    })

    return () => timers.forEach(clearTimeout)
  }, [navigate])

  return (
    <div className="loading">
      <Sidebar
        footer={
          <EyebrowLabel>powered by apify</EyebrowLabel>
        }
      >
        <div className="loading__meta">
          <EyebrowLabel>target</EyebrowLabel>
          <div className="loading__meta-value">Clay</div>
        </div>

        <div className="loading__meta">
          <EyebrowLabel>step</EyebrowLabel>
          <div className="loading__meta-value">
            {String(currentStep + 1).padStart(2, '0')} / 03
          </div>
        </div>
      </Sidebar>

      <main className="loading__main">
        <EyebrowLabel>researching</EyebrowLabel>

        <div className="loading__steps">
          {steps.map((step, index) => {
            let status: StepStatus = 'pending'
            if (index < currentStep) status = 'done'
            else if (index === currentStep) status = 'active'

            return (
              <div key={index} className={`loading-step loading-step--${status}`}>
                <div className={`loading-step__dot loading-step__dot--${status}`} />
                <div className="loading-step__label">{step.label}</div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
