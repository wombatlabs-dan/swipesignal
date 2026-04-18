import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import SwipeStack from '../SwipeStack'

describe('SwipeStack', () => {
  it('renders sidebar with target and progress', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText('TARGET')).toBeInTheDocument()
    expect(screen.getByText('Clay')).toBeInTheDocument()
    expect(screen.getByText('PROGRESS')).toBeInTheDocument()
  })

  it('renders keyboard hints in sidebar', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText('Good signal')).toBeInTheDocument()
    expect(screen.getByText('Worth a second look')).toBeInTheDocument()
  })

  it('renders approve and flag buttons', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(screen.getByText('✗')).toBeInTheDocument()
  })

  it('displays learned counter in sidebar footer', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Learned from/i)).toBeInTheDocument()
  })
})
