'use client'

import { useCallback, useLayoutEffect, useState } from 'react'
import { installFetchRecorder } from '../lib/recorder'
import type { HoverEvent, ProbeState, ResourceEntry, RscRequest } from '../types'

/**
 * 레이아웃에 한 번 마운트되어 라우트 이동 동안 유지되는 관측 훅.
 * 하위 페이지가 이동해도 로그가 사라지지 않도록 layout에서 호출한다.
 * 패치는 자식 effect(Link 마운트)보다 먼저 실행되도록 layout effect에서 설치한다.
 */
export function usePrefetchProbe(): ProbeState {
  const [requests, setRequests] = useState<RscRequest[]>([])
  const [hovers, setHovers] = useState<HoverEvent[]>([])
  const [resources, setResources] = useState<ResourceEntry[]>([])
  const [since, setSince] = useState(0)

  useLayoutEffect(() => {
    const uninstall = installFetchRecorder({
      onStart: (r) => setRequests((prev) => [...prev, r]),
      onUpdate: (id, patch) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    })
    const observer = new PerformanceObserver((list) => {
      const found = list
        .getEntries()
        .filter((e) => e.name.includes('_rsc='))
        .map((e) => ({ name: e.name, startTime: e.startTime, duration: e.duration }))
      if (found.length === 0) return
      setResources((prev) => {
        const fresh = found.filter((f) => !prev.some((p) => p.name === f.name && p.startTime === f.startTime))
        return fresh.length ? [...prev, ...fresh] : prev
      })
    })
    observer.observe({ type: 'resource', buffered: true })
    return () => {
      uninstall()
      observer.disconnect()
    }
  }, [])

  const recordHover = useCallback((label: string) => {
    setHovers((prev) => [...prev, { at: performance.now(), label }])
  }, [])

  const reset = useCallback(() => {
    setRequests([])
    setHovers([])
    setResources([])
    setSince(performance.now())
  }, [])

  return { requests, hovers, resources: resources.filter((r) => r.startTime >= since), since, recordHover, reset }
}
