import { useState, useCallback } from 'react'

export function useLoading(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [progress, setProgress] = useState(0)

  const startLoading = useCallback(() => {
    setIsLoading(true)
    setProgress(0)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setProgress(100)
  }, [])

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(newProgress)
  }, [])

  return { isLoading, progress, startLoading, stopLoading, updateProgress }
}

