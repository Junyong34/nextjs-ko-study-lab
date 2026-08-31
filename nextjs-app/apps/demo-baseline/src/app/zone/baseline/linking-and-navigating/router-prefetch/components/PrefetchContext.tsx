'use client'

import React, { createContext, useContext, useState } from 'react'

interface PrefetchContextState {
  isPrefetched: boolean
  setIsPrefetched: (val: boolean) => void
  prefetchTime: string | null
  setPrefetchTime: (time: string | null) => void
  lastAction: string
  setLastAction: (action: string) => void
}

const PrefetchContext = createContext<PrefetchContextState | null>(null)

export function PrefetchProvider({ children }: { children: React.ReactNode }) {
  const [isPrefetched, setIsPrefetched] = useState(false)
  const [prefetchTime, setPrefetchTime] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<string>('대기 중')

  return (
    <PrefetchContext.Provider
      value={{
        isPrefetched,
        setIsPrefetched,
        prefetchTime,
        setPrefetchTime,
        lastAction,
        setLastAction,
      }}
    >
      {children}
    </PrefetchContext.Provider>
  )
}

export function usePrefetch() {
  const context = useContext(PrefetchContext)
  return context
}
