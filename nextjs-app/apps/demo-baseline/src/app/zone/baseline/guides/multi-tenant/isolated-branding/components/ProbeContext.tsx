'use client'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { measureLive, runProbe } from '../lib/probe'
import type { LiveSnapshot, TenantSnapshot } from '../types'

interface ProbeValue {
  probe: TenantSnapshot[] | null
  live: LiveSnapshot | null
  running: boolean
  error: string | null
  run: () => Promise<void>
  clear: () => void
}

const Ctx = createContext<ProbeValue | null>(null)

/** demo layout 에 한 번 배치되어, 테넌트 page 사이를 이동해도 실측 결과가 유지된다. */
export function ProbeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [probe, setProbe] = useState<TenantSnapshot[] | null>(null)
  const [live, setLive] = useState<LiveSnapshot | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 경로가 바뀌면 렌더된 DOM 과 document.title 을 다시 읽는다. metadata 반영을 기다려 잠시 뒤에 측정한다.
  useEffect(() => {
    const t = setTimeout(() => setLive(measureLive()), 300)
    return () => clearTimeout(t)
  }, [pathname])

  const run = useCallback(async () => {
    setRunning(true)
    setError(null)
    setProbe(null)
    try {
      setProbe(await runProbe())
      setLive(measureLive())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }, [])
  const clear = useCallback(() => {
    setProbe(null)
    setError(null)
  }, [])

  const value = useMemo(() => ({ probe, live, running, error, run, clear }), [probe, live, running, error, run, clear])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProbe() {
  const v = useContext(Ctx)
  if (!v) throw new Error('ProbeProvider 안에서만 사용할 수 있습니다.')
  return v
}
