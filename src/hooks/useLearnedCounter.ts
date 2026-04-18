import { useState, useEffect } from 'react'

const STORAGE_KEY = 'swipesignal.learned'

export default function useLearnedCounter() {
  const [count, setCount] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored, 10) : 0
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, count.toString())
  }, [count])

  const increment = () => setCount(prev => prev + 1)
  const reset = () => setCount(0)

  return { count, increment, reset }
}
