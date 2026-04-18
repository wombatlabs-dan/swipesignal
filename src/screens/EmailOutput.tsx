import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import EyebrowLabel from '../components/EyebrowLabel'
import Button from '../components/Button'
import LearnedCounter from '../components/LearnedCounter'
import { clayCards } from '../data/clayCards'
import { clayEmailV1, clayEmailV2, EmailData } from '../data/clayEmail'
import './EmailOutput.css'

export default function EmailOutput() {
  const location = useLocation()
  const { approvedCards = [], flaggedCards = [], learnedCount = 0 } = location.state || {}

  const [emailVersion, setEmailVersion] = useState<EmailData>(clayEmailV1)
  const [copyButtonText, setCopyButtonText] = useState('Copy email')

  const handleCopy = async () => {
    const fullText = `Subject: ${emailVersion.subject}\n\n${emailVersion.body}`
    try {
      await navigator.clipboard.writeText(fullText)
      setCopyButtonText('Copied ✓')
      setTimeout(() => setCopyButtonText('Copy email'), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleRegenerate = () => {
    setTimeout(() => {
      setEmailVersion(prev => prev === clayEmailV1 ? clayEmailV2 : clayEmailV1)
    }, 600)
  }

  const approvedCardsData = clayCards.filter(c => approvedCards.includes(c.id))
  const flaggedCardsData = clayCards.filter(c => flaggedCards.includes(c.id))

  const renderHighlightedBody = (body: string, highlight: string) => {
    const parts = body.split(highlight)
    if (parts.length === 1) return body

    return (
      <>
        {parts[0]}
        <mark className="email__highlight">{highlight}</mark>
        {parts[1]}
      </>
    )
  }

  return (
    <div className="email-screen">
      <Sidebar
        footer={
          <LearnedCounter count={learnedCount} />
        }
      >
        <div className="email__meta">
          <EyebrowLabel>target</EyebrowLabel>
          <div className="email__meta-value">Clay</div>
        </div>

        <div className="email__basis">
          <EyebrowLabel>basis</EyebrowLabel>

          {approvedCardsData.map(card => (
            <div key={card.id} className="email__basis-chip">
              <span className="email__basis-mark email__basis-mark--approved">✓</span>
              <span className="email__basis-text">{card.insight}</span>
            </div>
          ))}

          {flaggedCardsData.map(card => (
            <div key={card.id} className="email__basis-chip">
              <span className="email__basis-mark email__basis-mark--flagged">✗</span>
              <span className="email__basis-text">{card.insight}</span>
            </div>
          ))}
        </div>
      </Sidebar>

      <main className="email__main">
        <div className="email__header">
          <EyebrowLabel>draft · cold email</EyebrowLabel>
          <EyebrowLabel>ready to send</EyebrowLabel>
        </div>

        <div className="email__subject-block">
          <EyebrowLabel>subject</EyebrowLabel>
          <h1 className="email__subject">{emailVersion.subject}</h1>
        </div>

        <div className="email__body">
          {renderHighlightedBody(emailVersion.body, emailVersion.highlightedPhrase)}
        </div>

        <div className="email__buttons">
          <Button onClick={handleCopy}>
            {copyButtonText}
          </Button>
          <Button variant="secondary" onClick={handleRegenerate}>
            Regenerate with different angle
          </Button>
        </div>
      </main>
    </div>
  )
}
