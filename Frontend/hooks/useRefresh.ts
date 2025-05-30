import { useState, useCallback } from 'react'

/**
 * Small helper that wraps any async function with Pull-to-Refresh state.
 * @param fn  the async function to run when the user refreshes
 */
export default function useRefresh(fn: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await fn()
    } finally {
      setRefreshing(false)
    }
  }, [fn])

  return { refreshing, onRefresh }
}
