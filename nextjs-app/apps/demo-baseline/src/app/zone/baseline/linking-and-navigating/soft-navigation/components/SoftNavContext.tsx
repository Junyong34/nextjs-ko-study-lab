'use client'

import React, { createContext, useContext, useState } from 'react'

interface SoftNavContextState {
  memo: string
  setMemo: (memo: string) => void
  seconds: number
  setSeconds: React.Dispatch<React.SetStateAction<number>>
}

const SoftNavContext = createContext<SoftNavContextState | null>(null)

export function SoftNavProvider({ children }: { children: React.ReactNode }) {
  const [memo, setMemo] = useState('')
  const [seconds, setSeconds] = useState(0)

  return (
    <SoftNavContext.Provider value={{ memo, setMemo, seconds, setSeconds }}>
      {children}
    </SoftNavContext.Provider>
  )
}

export function useSoftNav() {
  const context = useContext(SoftNavContext)
  return context
}
