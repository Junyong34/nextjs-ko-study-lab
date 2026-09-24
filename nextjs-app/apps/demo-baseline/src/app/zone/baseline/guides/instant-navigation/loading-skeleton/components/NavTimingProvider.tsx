'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  MARKER_ATTR,
  SERVER_MS_ATTR,
  VARIANTS,
  variantHref,
  type NavMeasurement,
  type Variant,
} from '../types'

type Results = Partial<Record<Variant, NavMeasurement>>

interface NavTimingContextValue {
  results: Results
  active: NavMeasurement | null
  startMeasure: (variant: Variant) => void
  observeSlot: (el: HTMLDivElement | null) => (() => void) | undefined
  reset: () => void
}

const NavTimingContext = createContext<NavTimingContextValue | null>(null)

/** 브라우저가 실제로 보낸 fetch 중 두 하위 경로로 향한 요청의 시작 시각 */
interface RouteFetch {
  variant: Variant
  startTime: number
  bytes: number
}

function matchVariant(url: string): Variant | null {
  const { pathname } = new URL(url, window.location.href)
  return VARIANTS.find((v) => pathname.startsWith(variantHref(v))) ?? null
}

/**
 * layout.tsx에 마운트되어 하위 경로 전환 중에도 리마운트되지 않는 측정기.
 * - 클릭 시각: Link onClick에서 performance.now()
 * - 스켈레톤/콘텐츠 등장 시각: children 슬롯을 감시하는 MutationObserver 콜백의 performance.now()
 * - prefetch 수: PerformanceObserver('resource')가 기록한 실제 fetch 중 클릭 이전 것
 */
export function NavTimingProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<Results>({})
  const [active, setActive] = useState<NavMeasurement | null>(null)
  const activeRef = useRef<NavMeasurement | null>(null)
  const fetchesRef = useRef<RouteFetch[]>([])
  const navWindowsRef = useRef<Array<{ variant: Variant; from: number; to: number }>>([])
  const runIdRef = useRef(0)

  const commit = useCallback((next: NavMeasurement) => {
    activeRef.current = next
    setActive(next)
    if (next.contentAt !== null) {
      navWindowsRef.current.push({ variant: next.variant, from: next.clickAt, to: next.contentAt })
      setResults((prev) => ({ ...prev, [next.variant]: next }))
    }
  }, [])

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
        if (entry.initiatorType !== 'fetch') continue
        const variant = matchVariant(entry.name)
        if (variant) fetchesRef.current.push({ variant, startTime: entry.startTime, bytes: entry.decodedBodySize })
      }
    })
    po.observe({ type: 'resource', buffered: true })
    return () => po.disconnect()
  }, [])

  const startMeasure = useCallback(
    (variant: Variant) => {
      const clickAt = performance.now()
      // 이전 클릭이 일으킨 전환 요청은 prefetch가 아니므로 제외한다.
      const isNavFetch = (f: RouteFetch) =>
        navWindowsRef.current.some((w) => w.variant === f.variant && f.startTime >= w.from && f.startTime <= w.to)
      const prefetches = fetchesRef.current.filter(
        (f) => f.variant === variant && f.startTime < clickAt && !isNavFetch(f),
      )
      runIdRef.current += 1
      commit({
        runId: runIdRef.current,
        variant,
        clickAt,
        skeletonAt: null,
        contentAt: null,
        serverMs: null,
        prefetchBeforeClick: prefetches.length,
        prefetchBytes: prefetches.reduce((sum, f) => sum + f.bytes, 0),
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      })
    },
    [commit],
  )

  const observeSlot = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return undefined
      const mo = new MutationObserver((records) => {
        const current = activeRef.current
        if (!current || current.contentAt !== null) return
        const now = performance.now()
        const next = { ...current }
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return
            const marked = node.matches(`[${MARKER_ATTR}]`) ? [node] : []
            marked.push(...Array.from(node.querySelectorAll(`[${MARKER_ATTR}]`)))
            for (const target of marked) {
              const [kind, variant] = (target.getAttribute(MARKER_ATTR) ?? '').split(':')
              if (variant !== next.variant) continue
              if (kind === 'skeleton' && next.skeletonAt === null) next.skeletonAt = now
              if (kind === 'content' && next.contentAt === null) {
                next.contentAt = now
                next.serverMs = Number(target.getAttribute(SERVER_MS_ATTR))
              }
            }
          })
        }
        if (next.skeletonAt !== current.skeletonAt || next.contentAt !== current.contentAt) commit(next)
      })
      mo.observe(el, { childList: true, subtree: true })
      return () => mo.disconnect()
    },
    [commit],
  )

  const reset = useCallback(() => {
    // 전환 요청 구간(navWindows)과 fetch 기록은 사실이므로 유지한다 — prefetch 판별에 계속 필요하다.
    activeRef.current = null
    setActive(null)
    setResults({})
  }, [])

  const value = useMemo(
    () => ({ results, active, startMeasure, observeSlot, reset }),
    [results, active, startMeasure, observeSlot, reset],
  )
  return <NavTimingContext.Provider value={value}>{children}</NavTimingContext.Provider>
}

export function useNavTiming() {
  const ctx = useContext(NavTimingContext)
  if (!ctx) throw new Error('useNavTiming must be used within NavTimingProvider')
  return ctx
}

/** layout의 children(하위 page / loading)을 감싸는 관측 대상 슬롯 */
export function MeasuredSlot({ children }: { children: React.ReactNode }) {
  const { observeSlot } = useNavTiming()
  return (
    <div ref={observeSlot} className="min-w-0">
      {children}
    </div>
  )
}
