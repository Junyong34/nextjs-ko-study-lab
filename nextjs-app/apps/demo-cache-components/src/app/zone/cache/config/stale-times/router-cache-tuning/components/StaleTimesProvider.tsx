'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { instrumentFetch } from '../lib/rscFetch'
import type { NavRecord, RouteKey, RscFetch } from '../types'

interface Pending {
  route: RouteKey
  startAt: number
  prevRenderId: string | null
  /** 이동 직전 이 경로의 마지막 RSC 응답 */
  lastFetch: RscFetch | null
}

interface StaleTimesLabValue {
  records: NavRecord[]
  fetches: RscFetch[]
  /** <Link> 클릭 직전에 호출 */
  begin: (route: RouteKey) => void
  /** 도착 page의 RenderReporter가 커밋 시점에 호출 */
  report: (route: RouteKey, renderId: string) => void
  reset: () => void
}

const Ctx = createContext<StaleTimesLabValue | null>(null)

/** 화면 커밋 뒤 늦게 끝나는 fetch 응답을 기다리는 시간 */
const SETTLE_MS = 400
/** 이 시간 안에 도착하지 않으면 측정을 버린다 */
const PENDING_TTL_MS = 15000

/**
 * 공유 layout에 마운트되어 static ↔ dynamic 이동 중에도 유지되는 측정기.
 * window.fetch를 감싸 RSC 요청(일반/prefetch)과 응답의 x-nextjs-stale-time 헤더를 기록하고,
 * <Link> 클릭부터 도착 page 커밋까지 나간 요청 수를 이동 기록으로 남긴다.
 */
export function StaleTimesProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<NavRecord[]>([])
  const [fetches, setFetches] = useState<RscFetch[]>([])
  const fetchesRef = useRef<RscFetch[]>([])
  const pendingRef = useRef<Pending | null>(null)
  const renderRef = useRef<Partial<Record<RouteKey, string>>>({})
  const seqRef = useRef(0)

  useEffect(
    () =>
      instrumentFetch((record) => {
        fetchesRef.current = [...fetchesRef.current, record]
        setFetches(fetchesRef.current)
      }),
    [],
  )

  const begin = useCallback((route: RouteKey) => {
    const lastFetch = [...fetchesRef.current].reverse().find((f) => f.route === route && f.status === 200) ?? null
    pendingRef.current = { route, startAt: performance.now(), prevRenderId: renderRef.current[route] ?? null, lastFetch }
  }, [])

  const report = useCallback((route: RouteKey, renderId: string) => {
    const endAt = performance.now()
    const pending = pendingRef.current
    renderRef.current[route] = renderId
    // 문서 최초 로드처럼 <Link> 클릭 없이 도착한 경우는 이동 기록으로 남기지 않는다
    if (!pending || pending.route !== route || endAt - pending.startAt > PENDING_TTL_MS) return
    pendingRef.current = null
    seqRef.current += 1
    const seq = seqRef.current
    window.setTimeout(() => {
      const inWindow = fetchesRef.current.filter((f) => f.route === route && f.startedAt >= pending.startAt && f.startedAt <= endAt)
      const last = pending.lastFetch
      const staleTimeSec = last?.staleTime ? Number(last.staleTime) : null
      const record: NavRecord = {
        seq,
        route,
        durationMs: Math.round(endAt - pending.startAt),
        navRequests: inWindow.filter((f) => !f.prefetch).length,
        prefetchRequests: inWindow.filter((f) => f.prefetch).length,
        renderId,
        prevRenderId: pending.prevRenderId,
        ageSec: last ? Math.round((pending.startAt - last.startedAt) / 100) / 10 : null,
        staleTimeSec: Number.isFinite(staleTimeSec) ? staleTimeSec : null,
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      }
      setRecords((list) => [...list, record])
    }, SETTLE_MS)
  }, [])

  // 이동 기록만 지운다. RSC 요청 기록은 브라우저의 Client Cache가 그대로 남아 있으므로
  // 경과 시간 계산에 계속 써야 해서 유지한다(새로고침하면 둘 다 비워진다).
  const reset = useCallback(() => setRecords([]), [])

  const value = useMemo(() => ({ records, fetches, begin, report, reset }), [records, fetches, begin, report, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStaleTimesLab() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStaleTimesLab must be used inside StaleTimesProvider')
  return ctx
}
