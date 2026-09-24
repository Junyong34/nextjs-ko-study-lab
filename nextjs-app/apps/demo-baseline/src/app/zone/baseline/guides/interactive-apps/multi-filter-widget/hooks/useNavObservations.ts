'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { normalizeSearch } from '../lib/filters'
import { evaluate } from '../lib/inspect'
import type { NavEntry, NavKind, ReloadObservation, ServerSnapshot, UnloadRecord } from '../types'

/** 새로고침 전/후 비교를 위한 관측 기록 키. 장바구니를 복원하는 데 쓰지 않는다. */
const UNLOAD_KEY = 'guides-interactive-apps-multi-filter-widget:unload'

type Pending = { kind: 'push' | 'popstate'; t0: number; cartBefore: number }

function currentSearch() {
  return normalizeSearch(new URLSearchParams(window.location.search))
}

function documentLoadKind(): NavKind {
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  const type = entry?.type ?? 'navigate'
  return `load:${type}` as NavKind
}

/**
 * 서버 렌더(renderId)가 화면에 도착할 때마다, 그 시점의 실제 브라우저 URL·장바구니 수량·
 * 컴포넌트 인스턴스 ID를 기록한다. 모든 값은 브라우저 API와 서버 prop에서 읽은 실측값이다.
 */
export function useNavObservations(snapshot: ServerSnapshot, cartCount: number) {
  const [entries, setEntries] = useState<NavEntry[]>([])
  const [mountId, setMountId] = useState<string | null>(null)
  const [reload, setReload] = useState<ReloadObservation | null>(null)

  const mountIdRef = useRef<string | null>(null)
  const pendingRef = useRef<Pending | null>(null)
  const seenRef = useRef(new Set<string>())
  const lastLoggedRef = useRef<string | null>(null)
  const cartRef = useRef(cartCount)
  const latestRef = useRef<{ entries: NavEntry[]; reload: ReloadObservation | null }>({ entries: [], reload: null })

  useEffect(() => {
    cartRef.current = cartCount
  }, [cartCount])

  useEffect(() => {
    latestRef.current = { entries, reload }
  }, [entries, reload])

  // 마운트: 인스턴스 ID 발급, popstate 감지, 새로고침 직전 기록(pagehide)과 직후 비교
  useEffect(() => {
    if (!mountIdRef.current) mountIdRef.current = crypto.randomUUID().slice(0, 6)
    const id = mountIdRef.current
    setMountId(id)

    try {
      const raw = sessionStorage.getItem(UNLOAD_KEY)
      sessionStorage.removeItem(UNLOAD_KEY)
      if (raw && documentLoadKind() === 'load:reload') {
        const before = JSON.parse(raw) as UnloadRecord
        setReload({ before, after: { search: currentSearch(), cartCount: cartRef.current, mountId: id } })
      }
    } catch {
      // sessionStorage를 쓸 수 없는 환경이면 새로고침 비교만 건너뛴다.
    }

    const onPopState = () => {
      pendingRef.current = { kind: 'popstate', t0: performance.now(), cartBefore: cartRef.current }
    }
    const onPageHide = () => {
      const record: UnloadRecord = {
        search: currentSearch(),
        cartCount: cartRef.current,
        mountId: id,
        at: new Date().toISOString(),
        priorChecks: evaluate(latestRef.current.entries, latestRef.current.reload).slice(0, 4),
      }
      try {
        sessionStorage.setItem(UNLOAD_KEY, JSON.stringify(record))
      } catch {
        // 무시
      }
    }
    window.addEventListener('popstate', onPopState)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [])

  // 새 서버 렌더 결과가 커밋될 때마다 한 줄 기록
  useEffect(() => {
    if (lastLoggedRef.current === snapshot.renderId) return
    lastLoggedRef.current = snapshot.renderId

    const pending = pendingRef.current
    pendingRef.current = null
    const reusedRender = seenRef.current.has(snapshot.renderId)
    seenRef.current.add(snapshot.renderId)

    const entry: Omit<NavEntry, 'seq'> = {
      kind: pending?.kind ?? documentLoadKind(),
      urlSearch: currentSearch(),
      serverSearch: snapshot.receivedSearch,
      renderId: snapshot.renderId,
      renderedAt: snapshot.renderedAt,
      count: snapshot.count,
      reusedRender,
      cartBefore: pending ? pending.cartBefore : null,
      cartAfter: cartRef.current,
      mountId: mountIdRef.current ?? '-',
      ms: pending ? Math.round(performance.now() - pending.t0) : null,
    }
    setEntries((prev) => [...prev, { ...entry, seq: (prev.at(-1)?.seq ?? 0) + 1 }])
  }, [snapshot])

  /** 필터 칩 클릭 직전에 호출: 이동 시작 시각과 그때의 장바구니 수량을 기록 */
  const markPush = useCallback(() => {
    pendingRef.current = { kind: 'push', t0: performance.now(), cartBefore: cartRef.current }
  }, [])

  const clearEntries = useCallback(() => {
    setEntries([])
    setReload(null)
  }, [])

  return { entries, mountId, reload, markPush, clearEntries }
}
