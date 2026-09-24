'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { DrawerReport, DrawerReports, DrawerSlot, PlacementSnapshot } from '../types'
import { canRecordBefore, collectDrawers } from '../verification'

interface PlacementObserverValue {
  pathname: string
  current: Record<DrawerSlot, DrawerReport> | null
  before: PlacementSnapshot | null
  after: PlacementSnapshot | null
  canRecord: boolean
  report: (report: DrawerReport) => void
  recordBefore: () => void
  reset: () => void
}

const PlacementObserverContext = createContext<PlacementObserverValue | undefined>(undefined)

/**
 * 관측 기록기. layout.tsx에 있으므로 하위 page 이동에도 유지되어,
 * 이동 전 기록(before)과 이동 직후 스냅샷(after)을 함께 보관할 수 있다.
 * Drawer 상태 자체는 여기 두지 않는다 — 각 Drawer가 자기 useState를 갖고 보고만 한다.
 */
export function PlacementObserver({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [reports, setReports] = useState<DrawerReports>({})
  const [before, setBefore] = useState<PlacementSnapshot | null>(null)
  const [after, setAfter] = useState<PlacementSnapshot | null>(null)

  const report = useCallback((next: DrawerReport) => {
    setReports((prev) => ({ ...prev, [next.slot]: next }))
  }, [])

  const current = collectDrawers(reports, pathname)
  const canRecord = canRecordBefore(current)

  const recordBefore = useCallback(() => {
    if (!current || !canRecordBefore(current)) return
    setBefore({ pathname, timeOrigin: performance.timeOrigin, drawers: current })
    setAfter(null)
  }, [current, pathname])

  const reset = useCallback(() => {
    setBefore(null)
    setAfter(null)
  }, [])

  // 기록 후 다른 경로로 이동하고 세 Drawer가 모두 새 경로에서 보고를 마친 첫 시점을 고정한다.
  useEffect(() => {
    if (!before || after || !current || pathname === before.pathname) return
    setAfter({ pathname, timeOrigin: performance.timeOrigin, drawers: current })
  }, [before, after, current, pathname])

  const value = useMemo<PlacementObserverValue>(
    () => ({ pathname, current, before, after, canRecord, report, recordBefore, reset }),
    [pathname, current, before, after, canRecord, report, recordBefore, reset],
  )

  return <PlacementObserverContext.Provider value={value}>{children}</PlacementObserverContext.Provider>
}

export function usePlacementObserver() {
  const ctx = useContext(PlacementObserverContext)
  if (!ctx) throw new Error('usePlacementObserver must be used within PlacementObserver')
  return ctx
}
