import { useState, useRef, useCallback } from 'react'

interface UseDragOptions {
  threshold?: number
  maxDisplacement?: number
  onSwipeRight?: () => void
  onSwipeLeft?: () => void
}

export default function useDrag({
  threshold = 100,
  maxDisplacement = 280,
  onSwipeRight,
  onSwipeLeft,
}: UseDragOptions = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const [x, setX] = useState(0)
  const startX = useRef(0)

  const tilt = Math.min(Math.abs(x) / 50, 3) * Math.sign(x)
  const glowOpacity = Math.min(Math.abs(x) / maxDisplacement / 0.4, 1)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    startX.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const displacement = e.clientX - startX.current
    const clamped = Math.max(-maxDisplacement, Math.min(maxDisplacement, displacement))
    setX(clamped)
  }, [isDragging, maxDisplacement])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)

    if (x > threshold && onSwipeRight) {
      onSwipeRight()
    } else if (x < -threshold && onSwipeLeft) {
      onSwipeLeft()
    } else {
      // Snap back
      setX(0)
    }
  }, [x, threshold, onSwipeRight, onSwipeLeft])

  const reset = useCallback(() => {
    setX(0)
    setIsDragging(false)
  }, [])

  return {
    x,
    tilt,
    glowOpacity,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    reset,
  }
}
