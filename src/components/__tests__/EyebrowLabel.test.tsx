import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EyebrowLabel from '../EyebrowLabel'

describe('EyebrowLabel', () => {
  it('renders the label text in uppercase', () => {
    render(<EyebrowLabel>target company</EyebrowLabel>)
    expect(screen.getByText('TARGET COMPANY')).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    const { container } = render(<EyebrowLabel>test</EyebrowLabel>)
    const label = container.firstChild as HTMLElement
    expect(label).toHaveStyle({
      fontSize: '11px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    })
  })
})
