import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import useLearnedCounter from '../useLearnedCounter'

describe('useLearnedCounter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes to 0 when localStorage is empty', () => {
    const { result } = renderHook(() => useLearnedCounter())
    expect(result.current.count).toBe(0)
  })

  it('loads existing value from localStorage', () => {
    localStorage.setItem('swipesignal.learned', '5')
    const { result } = renderHook(() => useLearnedCounter())
    expect(result.current.count).toBe(5)
  })

  it('increments the counter', () => {
    const { result } = renderHook(() => useLearnedCounter())
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
    expect(localStorage.getItem('swipesignal.learned')).toBe('1')
  })

  it('resets the counter', () => {
    localStorage.setItem('swipesignal.learned', '10')
    const { result } = renderHook(() => useLearnedCounter())
    act(() => {
      result.current.reset()
    })
    expect(result.current.count).toBe(0)
    expect(localStorage.getItem('swipesignal.learned')).toBe('0')
  })
})
