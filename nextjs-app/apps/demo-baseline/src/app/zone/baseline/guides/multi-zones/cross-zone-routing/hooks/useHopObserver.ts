'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { HopKind, HopRecord } from '../types'
import { HOP_TARGET, zoneOfDocument } from '../lib/zone'

// <Link>가 아무 일도 하지 않는 경우를 "이동 안 됨"으로 확정하기까지 기다리는 시간
const SETTLE_MS = 8000

interface Pending {
  kind: HopKind
  timeOrigin: number
  startedAt: number
}

function readFrame(frame: HTMLIFrameElement | null) {
  const win = frame?.contentWindow
  try {
    if (!win || !win.document.body) return null
    const nav = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    return {
      timeOrigin: win.performance.timeOrigin,
      path: win.location.pathname,
      navType: nav?.type ?? null,
      zone: zoneOfDocument(win.document),
      screen: win.document.querySelector<HTMLElement>('[data-hop-screen]')?.dataset.hopScreen ?? null,
    }
  } catch {
    // 다른 origin 문서로 이동하면 접근이 막힌다 (이 데모의 링크는 모두 같은 origin이라 정상이라면 오지 않는다).
    return null
  }
}

/**
 * iframe 안의 이동을 바깥에서 관찰한다.
 * - 새 문서인지: iframe의 performance.timeOrigin이 바뀌었는지 (soft navigation이면 그대로다)
 * - 어느 zone인지: iframe 문서의 script src 접두사
 */
export function useHopObserver() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const pendingRef = useRef<Pending | null>(null)
  const [pending, setPending] = useState<HopKind | null>(null)
  const [hops, setHops] = useState<HopRecord[]>([])
  const [frameKey, setFrameKey] = useState(0)

  const finish = useCallback((record: HopRecord) => {
    pendingRef.current = null
    setPending(null)
    setHops((prev) => [record, ...prev.filter((h) => h.kind !== record.kind)])
  }, [])

  // iframe 문서 안의 클릭을 캡처 단계에서 가로채 "어떤 링크를 눌렀는지"만 기록한다. 이동은 막지 않는다.
  const attach = useCallback(() => {
    const doc = frameRef.current?.contentDocument
    if (!doc) return
    doc.addEventListener(
      'click',
      (e) => {
        const kind = (e.target as Element | null)?.closest<HTMLElement>('[data-hop-kind]')?.dataset.hopKind as HopKind | undefined
        const now = readFrame(frameRef.current)
        if (!kind || !now || pendingRef.current) return
        pendingRef.current = { kind, timeOrigin: now.timeOrigin, startedAt: Date.now() }
        setPending(kind)
      },
      true,
    )
  }, [])

  // React가 붙기 전에 iframe이 먼저 로드를 끝낸 경우에도 클릭 기록을 붙인다.
  useEffect(() => {
    const doc = frameRef.current?.contentDocument
    if (doc?.readyState === 'complete' && doc.location.href !== 'about:blank') attach()
  }, [frameKey, attach])

  // load 이벤트는 새 문서가 로드될 때만 발생한다.
  const onLoad = useCallback(() => {
    attach()
    const p = pendingRef.current
    const now = readFrame(frameRef.current)
    if (!p || !now) return
    finish({ kind: p.kind, path: now.path, newDocument: now.timeOrigin !== p.timeOrigin, navType: now.navType, zone: now.zone, screen: now.screen })
  }, [attach, finish])

  // 새 문서가 없는 이동(soft navigation)과 "아무 일도 안 일어남"은 폴링으로 확인한다.
  useEffect(() => {
    if (!pending) return
    const timer = setInterval(() => {
      const p = pendingRef.current
      const now = readFrame(frameRef.current)
      if (!p || !now || now.timeOrigin !== p.timeOrigin) return
      const arrived = now.path === HOP_TARGET[p.kind] && now.screen !== 'hop'
      if (arrived || Date.now() - p.startedAt > SETTLE_MS) {
        finish({ kind: p.kind, path: now.path, newDocument: false, navType: null, zone: now.zone, screen: now.screen })
      }
    }, 250)
    return () => clearInterval(timer)
  }, [pending, finish])

  /** 출발 화면으로 되돌린다. 기록은 유지한다. */
  const backToStart = () => {
    pendingRef.current = null
    setPending(null)
    setFrameKey((k) => k + 1)
  }

  const reset = () => {
    backToStart()
    setHops([])
  }

  return { frameRef, frameKey, onLoad, pending, hops, backToStart, reset }
}
