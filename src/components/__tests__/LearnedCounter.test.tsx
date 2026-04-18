import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LearnedCounter from '../LearnedCounter'

describe('LearnedCounter', () => {
  it('renders singular form for count of 1', () => {
    const { container } = render(<LearnedCounter count={1} />)
    expect(container.textContent).toMatch(/Learned from 1 correction\./i)
  })

  it('renders plural form for count != 1', () => {
    const { container } = render(<LearnedCounter count={3} />)
    expect(container.textContent).toMatch(/Learned from 3 corrections\./i)
  })

  it('renders count of 0', () => {
    const { container } = render(<LearnedCounter count={0} />)
    expect(container.textContent).toMatch(/Learned from 0 corrections\./i)
  })

  it('applies animating class when prop is true', () => {
    const { container } = render(<LearnedCounter count={5} animating />)
    const numeral = container.querySelector('.learned-counter__numeral')
    expect(numeral).toHaveClass('learned-counter__numeral--animating')
  })
})
