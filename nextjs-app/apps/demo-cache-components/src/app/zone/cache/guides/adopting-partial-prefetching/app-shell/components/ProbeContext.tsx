'use client'

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { installFetchRecorder } from '../lib/recorder'
import type { RscRequest } from '../types'

interface ProbeValue {
  requests: RscRequest[]
  reset: () => void
}

const Ctx = createContext<ProbeValue | null>(null)

/** layout에 한 번 마운트되어 라우트 이동 동안 로그가 유지된다. 패치는 Link 마운트(자식 effect)보다 먼저 설치한다. */
export function ProbeProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<RscRequest[]>([])

  useLayoutEffect(
    () =>
      installFetchRecorder({
        onStart: (r) => setRequests((prev) => [...prev, r]),
        onUpdate: (id, patch) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r))),
      }),
    [],
  )

  const reset = useCallback(() => setRequests([]), [])
  const value = useMemo(() => ({ requests, reset }), [requests, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProbe(): ProbeValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProbe()는 <ProbeProvider> 안에서만 호출할 수 있습니다.')
  return ctx
}
