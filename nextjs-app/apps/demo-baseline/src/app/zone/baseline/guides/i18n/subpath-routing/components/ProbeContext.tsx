'use client'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { runProbe } from '../probe'
import type { RouteCheck } from '../types'

interface ProbeValue {
  checks: RouteCheck[] | null
  running: boolean
  error: string | null
  run: () => Promise<void>
  clear: () => void
}

const Ctx = createContext<ProbeValue | null>(null)

/** demo layout에 한 번 배치되어, 언어 page 사이를 이동해도 실측 결과가 유지된다. */
export function ProbeProvider({ children }: { children: React.ReactNode }) {
  const [checks, setChecks] = useState<RouteCheck[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    setRunning(true)
    setError(null)
    setChecks(null)
    try {
      setChecks(await runProbe())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }, [])
  const clear = useCallback(() => {
    setChecks(null)
    setError(null)
  }, [])

  const value = useMemo(() => ({ checks, running, error, run, clear }), [checks, running, error, run, clear])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProbe() {
  const v = useContext(Ctx)
  if (!v) throw new Error('ProbeProvider 안에서만 사용할 수 있습니다.')
  return v
}
