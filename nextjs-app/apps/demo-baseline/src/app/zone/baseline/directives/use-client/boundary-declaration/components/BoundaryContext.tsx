'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import type { AttemptResult, BoundaryState } from '../types'

const IDLE: AttemptResult = { status: 'idle', detail: '아직 시도하지 않았습니다.' }

const BoundaryContext = createContext<BoundaryState | null>(null)

export function BoundaryProvider({ children }: { children: React.ReactNode }) {
  const [serverAttempt, setServerAttempt] = useState<AttemptResult>(IDLE)
  const [clientAttempt, setClientAttempt] = useState<AttemptResult>(IDLE)
  const [leafAttempt, setLeafAttempt] = useState<AttemptResult>(IDLE)

  const reset = useCallback(() => {
    setServerAttempt(IDLE)
    setClientAttempt(IDLE)
    setLeafAttempt(IDLE)
  }, [])

  return (
    <BoundaryContext.Provider
      value={{
        serverAttempt,
        clientAttempt,
        leafAttempt,
        setServerAttempt,
        setClientAttempt,
        setLeafAttempt,
        reset,
      }}
    >
      {children}
    </BoundaryContext.Provider>
  )
}

export function useBoundaryState(): BoundaryState {
  const ctx = useContext(BoundaryContext)
  if (!ctx) {
    throw new Error('useBoundaryState는 BoundaryProvider 하위에서만 사용할 수 있습니다.')
  }
  return ctx
}
