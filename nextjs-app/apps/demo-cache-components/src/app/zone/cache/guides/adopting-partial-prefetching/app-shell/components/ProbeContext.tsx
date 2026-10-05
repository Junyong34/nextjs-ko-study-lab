'use client'

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { installFetchRecorder } from '../lib/recorder'
import type { Area, ClickRun, LinkKind, RouteKind, RscRequest } from '../types'

interface ProbeValue {
  requests: RscRequest[]
  runs: ClickRun[]
  recordClick: (route: RouteKind, link: LinkKind, id: string) => void
  markArrival: (area: Area) => void
  reset: () => void
}

const Ctx = createContext<ProbeValue | null>(null)

/**
 * layout에 한 번 마운트되어 라우트 이동 동안 로그가 유지된다. fetch 패치는 Link 마운트(자식 effect)보다 먼저 설치한다.
 * 클릭 시각은 ref에 둔다 — 도착 마커가 마운트될 때 state 갱신을 기다리지 않고 읽어야 하기 때문이다.
 */
export function ProbeProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<RscRequest[]>([])
  const [runs, setRuns] = useState<ClickRun[]>([])
  const clickAt = useRef<number | null>(null)
  const runNo = useRef(0)

  useLayoutEffect(
    () =>
      installFetchRecorder({
        onStart: (r) => setRequests((prev) => [...prev, r]),
        onUpdate: (id, patch) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r))),
      }),
    [],
  )

  const recordClick = useCallback((route: RouteKind, link: LinkKind, id: string) => {
    clickAt.current = performance.now()
    runNo.current += 1
    const n = runNo.current
    setRuns((prev) => [...prev, { runNo: n, route, link, id, arrivals: {} }].slice(-12))
  }, [])

  const markArrival = useCallback((area: Area) => {
    if (clickAt.current === null) return
    const ms = Math.round(performance.now() - clickAt.current)
    const n = runNo.current
    setRuns((prev) =>
      prev.map((r) => (r.runNo === n && r.arrivals[area] === undefined ? { ...r, arrivals: { ...r.arrivals, [area]: ms } } : r)),
    )
  }, [])

  const reset = useCallback(() => {
    setRequests([])
    setRuns([])
    clickAt.current = null
  }, [])

  const value = useMemo(() => ({ requests, runs, recordClick, markArrival, reset }), [requests, runs, recordClick, markArrival, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProbe(): ProbeValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProbe()는 <ProbeProvider> 안에서만 호출할 수 있습니다.')
  return ctx
}
