import '@testing-library/jest-dom'
import { beforeEach, afterEach } from 'vitest'
import '../styles/tokens.css'

// Inject CSS directly into the document for testing
// This allows toHaveStyle to work correctly with CSS classes
beforeEach(() => {
  // Set CSS variables on :root
  document.documentElement.style.setProperty('--size-eyebrow', '11px')
  document.documentElement.style.setProperty('--font-sans', 'Inter, sans-serif')
  document.documentElement.style.setProperty('--color-text-secondary', '#666666')

  // Inject the CSS rules directly
  const style = document.createElement('style')
  style.innerHTML = `
    .eyebrow-label {
      font-family: var(--font-sans);
      font-size: var(--size-eyebrow);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--color-text-secondary);
    }
  `
  document.head.appendChild(style)
})

afterEach(() => {
  // Clean up injected styles
  document.head.querySelectorAll('style').forEach(style => style.remove())
})
