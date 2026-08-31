'use client'
import React, { createContext, useContext, useState } from 'react'

interface RootNestedContextType {
  clickCount: number
  increment: () => void
}

const RootNestedContext = createContext<RootNestedContextType | undefined>(undefined)

export function RootNestedProvider({ children }: { children: React.ReactNode }) {
  const [clickCount, setClickCount] = useState(0)
  const increment = () => setClickCount((c) => c + 1)

  return (
    <RootNestedContext.Provider value={{ clickCount, increment }}>
      {children}
    </RootNestedContext.Provider>
  )
}

export function useRootNested() {
  const ctx = useContext(RootNestedContext)
  if (!ctx) {
    throw new Error('useRootNested must be used within RootNestedProvider')
  }
  return ctx
}
