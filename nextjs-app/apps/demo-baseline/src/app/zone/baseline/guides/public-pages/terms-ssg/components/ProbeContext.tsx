'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { PROBE_TARGETS } from '../terms'
import { probeTarget } from '../probe'
import type { TargetResult } from '../types'

interface ProbeContextValue {
  results: TargetResult[]
  running: boolean
  error: string | null
  run: () => Promise<void>
  clear: () => void
}

const ProbeContext = createContext<ProbeContextValue | null>(null)

/** layout에 한 번 배치되어, 약관 하위 page 사이를 이동해도 실측 결과가 유지되게 한다. */
export function ProbeProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<TargetResult[]>([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    setRunning(true)
    setError(null)
    setResults([])
    try {
      const next: TargetResult[] = []
      for (const target of PROBE_TARGETS) {
        next.push(await probeTarget(target))
        setResults([...next])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  const value = useMemo(() => ({ results, running, error, run, clear }), [results, running, error, run, clear])
  return <ProbeContext.Provider value={value}>{children}</ProbeContext.Provider>
}

export function useProbe(): ProbeContextValue {
  const ctx = useContext(ProbeContext)
  if (!ctx) throw new Error('useProbe()는 <ProbeProvider> 안에서만 호출할 수 있습니다.')
  return ctx
}
