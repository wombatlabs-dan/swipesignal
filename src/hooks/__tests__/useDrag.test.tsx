import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useDrag from '../useDrag'

describe('useDrag', () => {
  it('initializes with zero displacement', () => {
    const { result } = renderHook(() => useDrag())
    expect(result.current.x).toBe(0)
    expect(result.current.isDragging).toBe(false)
  })

  it('tracks drag displacement', () => {
    const { result } = renderHook(() => useDrag())
    const mockTarget = {
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
    }

    act(() => {
      result.current.handlers.onPointerDown({
        clientX: 0,
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    act(() => {
      result.current.handlers.onPointerMove({ clientX: 150 } as React.PointerEvent)
    })

    expect(result.current.x).toBe(150)
    expect(result.current.isDragging).toBe(true)
  })

  it('calculates tilt based on displacement', () => {
    const { result } = renderHook(() => useDrag())
    const mockTarget = {
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
    }

    act(() => {
      result.current.handlers.onPointerDown({
        clientX: 0,
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    act(() => {
      result.current.handlers.onPointerMove({ clientX: 100 } as React.PointerEvent)
    })

    expect(result.current.tilt).toBeGreaterThan(0)
    expect(result.current.tilt).toBeLessThanOrEqual(3)
  })

  it('calls onSwipeRight when threshold exceeded', () => {
    let swipedRight = false
    const { result } = renderHook(() =>
      useDrag({
        onSwipeRight: () => { swipedRight = true },
        threshold: 100,
      })
    )
    const mockTarget = {
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
    }

    act(() => {
      result.current.handlers.onPointerDown({
        clientX: 0,
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    act(() => {
      result.current.handlers.onPointerMove({ clientX: 150 } as React.PointerEvent)
    })

    act(() => {
      result.current.handlers.onPointerUp({
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    expect(swipedRight).toBe(true)
  })

  it('calls onSwipeLeft when negative threshold exceeded', () => {
    let swipedLeft = false
    const { result } = renderHook(() =>
      useDrag({
        onSwipeLeft: () => { swipedLeft = true },
        threshold: 100,
      })
    )
    const mockTarget = {
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
    }

    act(() => {
      result.current.handlers.onPointerDown({
        clientX: 0,
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    act(() => {
      result.current.handlers.onPointerMove({ clientX: -150 } as React.PointerEvent)
    })

    act(() => {
      result.current.handlers.onPointerUp({
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    expect(swipedLeft).toBe(true)
  })

  it('snaps back when threshold not exceeded', () => {
    const { result } = renderHook(() => useDrag({ threshold: 100 }))
    const mockTarget = {
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
    }

    act(() => {
      result.current.handlers.onPointerDown({
        clientX: 0,
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    act(() => {
      result.current.handlers.onPointerMove({ clientX: 50 } as React.PointerEvent)
    })

    act(() => {
      result.current.handlers.onPointerUp({
        target: mockTarget,
        pointerId: 1
      } as any)
    })

    expect(result.current.x).toBe(0)
    expect(result.current.isDragging).toBe(false)
  })
})
