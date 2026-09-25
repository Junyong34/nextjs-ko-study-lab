'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { RCB_BASE_PATH, routeFromPath, type NavKind, type NavRecord, type RouteKey, type ServerRender } from '../types'

interface Pending {
  kind: NavKind
  startAt: number
  route: RouteKey
  prevRenderId: string | null
}

interface RouterCacheLabValue {
  records: NavRecord[]
  current: ServerRender | null
  /** <Link> 클릭 또는 router.refresh() 직전에 호출 */
  begin: (kind: 'link' | 'refresh', route: RouteKey) => void
  /** router.back()/forward() 직전에 호출. 도착 경로는 popstate에서 확정한다. */
  beginHistory: (kind: 'back' | 'forward') => void
  report: (render: ServerRender) => void
  reset: () => void
}

const Ctx = createContext<RouterCacheLabValue | null>(null)

/** 이동이 이 시간 안에 화면에 반영되지 않으면 측정을 버린다(예: 시작 화면으로 뒤로 가기). */
const PENDING_TTL_MS = 15000
/** 화면 커밋 뒤 Resource Timing 항목이 기록되기를 기다리는 시간 */
const SETTLE_MS = 500

interface RouteFetch {
  startTime: number
  path: string
}

/**
 * 공유 layout.tsx에 마운트되어 하위 page 이동 중에도 유지되는 측정기.
 * - 시작 시각: 클릭/호출 시점 또는 popstate 시점의 performance.now()
 * - 끝 시각: 도착 page의 RenderReporter가 커밋 시점에 report()를 부른 performance.now()
 * - RSC 요청 수: PerformanceObserver('resource')가 본, 시작~끝 사이에 시작된 도착 경로로의 fetch
 */
export function RouterCacheProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<NavRecord[]>([])
  const [current, setCurrent] = useState<ServerRender | null>(null)
  const pendingRef = useRef<Pending | null>(null)
  const historyIntentRef = useRef<{ kind: 'back' | 'forward'; startAt: number } | null>(null)
  const currentRef = useRef<ServerRender | null>(null)
  const seenRef = useRef(new Set<string>())
  const fetchesRef = useRef<RouteFetch[]>([])
  const seqRef = useRef(0)
  /** 경로별로 마지막으로 화면에 커밋된 기록 seq, 마지막 refresh 기록 seq */
  const lastShownRef = useRef<Partial<Record<RouteKey, number>>>({})
  const lastRefreshRef = useRef(0)

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
        if (entry.initiatorType !== 'fetch') continue
        const url = new URL(entry.name, window.location.href)
        if (!url.pathname.startsWith(`${RCB_BASE_PATH}/`)) continue
        fetchesRef.current.push({ startTime: entry.startTime, path: url.pathname.slice(RCB_BASE_PATH.length) + url.search })
      }
    })
    po.observe({ type: 'resource', buffered: true })
    return () => po.disconnect()
  }, [])

  // 뒤로/앞으로 이동은 버튼이든 브라우저 UI든 popstate로 도착한다.
  useEffect(() => {
    const onPopState = () => {
      const intent = historyIntentRef.current
      historyIntentRef.current = null
      const route = routeFromPath(window.location.pathname)
      if (!route) {
        pendingRef.current = null
        return
      }
      pendingRef.current = {
        kind: intent?.kind ?? 'browser',
        startAt: intent?.startAt ?? performance.now(),
        route,
        prevRenderId: currentRef.current?.renderId ?? null,
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const begin = useCallback((kind: 'link' | 'refresh', route: RouteKey) => {
    pendingRef.current = { kind, startAt: performance.now(), route, prevRenderId: currentRef.current?.renderId ?? null }
  }, [])

  const beginHistory = useCallback((kind: 'back' | 'forward') => {
    historyIntentRef.current = { kind, startAt: performance.now() }
  }, [])

  const report = useCallback((render: ServerRender) => {
    const endAt = performance.now()
    const prev = currentRef.current
    const wasSeen = seenRef.current.has(render.renderId)
    seenRef.current.add(render.renderId)
    currentRef.current = render
    setCurrent(render)

    let pending = pendingRef.current
    if (pending && endAt - pending.startAt > PENDING_TTL_MS) pending = null
    const completes =
      pending !== null &&
      pending.route === render.route &&
      (pending.kind !== 'refresh' || render.renderId !== pending.prevRenderId)

    if (!completes) {
      // 대기 중인 이동이 없는데 처음 보는 렌더 ID = 문서 최초 로드(HTML). 같은 ID 재보고(StrictMode 재실행)는 무시.
      if (!pending && !wasSeen && prev?.renderId !== render.renderId) {
        seqRef.current += 1
        const seq = seqRef.current
        lastShownRef.current[render.route] = seq
        setRecords((rs) => [...rs, makeRecord(seq, 'document', render, false, false, null, [], null)])
      }
      return
    }

    pendingRef.current = null
    const { kind, startAt } = pending as Pending
    seqRef.current += 1
    const seq = seqRef.current
    const isHistory = kind === 'back' || kind === 'forward' || kind === 'browser'
    const afterRefresh = isHistory && lastRefreshRef.current > (lastShownRef.current[render.route] ?? 0)
    lastShownRef.current[render.route] = seq
    if (kind === 'refresh') lastRefreshRef.current = seq
    window.setTimeout(() => {
      const inWindow = fetchesRef.current.filter((f) => f.startTime >= startAt && f.startTime <= endAt)
      // 도착 경로로 간 요청만 이동 요청으로 센다. 다른 경로(화면에 보이는 링크의 재-prefetch 등)는 따로 센다.
      const target = `/${render.route}?`
      const hits = inWindow.filter((f) => f.path.startsWith(target))
      const record = makeRecord(seq, kind, render, wasSeen, afterRefresh, hits.length, hits.map((h) => h.path), Math.round(endAt - startAt))
      record.otherFetches = inWindow.length - hits.length
      setRecords((rs) => [...rs, record])
    }, SETTLE_MS)
  }, [])

  const reset = useCallback(() => setRecords([]), [])

  const value = useMemo(
    () => ({ records, current, begin, beginHistory, report, reset }),
    [records, current, begin, beginHistory, report, reset],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function makeRecord(
  seq: number,
  kind: NavKind,
  render: ServerRender,
  reused: boolean,
  afterRefresh: boolean,
  rscCount: number | null,
  rscPaths: string[],
  durationMs: number | null,
): NavRecord {
  return {
    seq,
    kind,
    route: render.route,
    renderId: render.renderId,
    renderedAt: render.renderedAt,
    reused,
    afterRefresh,
    rscCount,
    rscPaths,
    otherFetches: 0,
    durationMs,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  }
}

export function useRouterCacheLab() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRouterCacheLab must be used inside RouterCacheProvider')
  return ctx
}
