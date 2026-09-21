'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { RunTimeline } from '../types'
import {
  applyCatalogFallback,
  applyCatalogReady,
  applyProductFallback,
  applyParentAction,
  applyProductReady,
} from '../verification'

interface LoadingObservationContextValue {
  activeRunId: string | null
  timeline: RunTimeline | null
  startRun: (runId: string) => void
  markCatalogFallback: (runId: string) => void
  markCatalogReady: (runId: string) => void
  markProductFallback: (runId: string, productId: string) => void
  markParentAction: (runId: string) => void
  markProductReady: (runId: string, productId: string) => void
  reset: () => void
}

const LoadingObservationContext = createContext<LoadingObservationContextValue | undefined>(undefined)

/**
 * 이 Provider는 nested-segment-loading/layout.tsx에 마운트되어 home page.tsx와
 * catalog/** 하위 라우트 전체의 공통 조상으로 유지된다. 실제 loading.tsx·page.tsx가
 * 마운트될 때마다 이 인스턴스에 이벤트를 보고하므로, 검증 패널은 실제 라우트 전이와
 * 무관하게 항상 같은(리마운트되지 않는) 타임라인을 관찰한다.
 */
export function LoadingObservationProvider({ children }: { children: React.ReactNode }) {
  const [activeRunId, setActiveRunId] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<RunTimeline | null>(null)

  const startRun = useCallback((runId: string) => {
    setActiveRunId(runId)
    setTimeline((prev) => (prev && prev.runId === runId ? prev : null))
  }, [])

  const markCatalogFallback = useCallback((runId: string) => {
    setActiveRunId(runId)
    setTimeline((prev) => applyCatalogFallback(prev, runId, Date.now()))
  }, [])

  const markCatalogReady = useCallback((runId: string) => {
    setActiveRunId(runId)
    setTimeline((prev) => applyCatalogReady(prev, runId, Date.now()))
  }, [])

  const markProductFallback = useCallback((runId: string, productId: string) => {
    setActiveRunId(runId)
    setTimeline((prev) => applyProductFallback(prev, runId, productId, Date.now()))
  }, [])

  const markParentAction = useCallback((runId: string) => {
    setActiveRunId(runId)
    setTimeline((prev) => applyParentAction(prev, runId, Date.now()))
  }, [])

  const markProductReady = useCallback((runId: string, productId: string) => {
    setActiveRunId(runId)
    setTimeline((prev) => applyProductReady(prev, runId, productId, Date.now()))
  }, [])

  const reset = useCallback(() => {
    setActiveRunId(null)
    setTimeline(null)
  }, [])

  const value = useMemo<LoadingObservationContextValue>(
    () => ({
      activeRunId,
      timeline,
      startRun,
      markCatalogFallback,
      markCatalogReady,
      markProductFallback,
      markParentAction,
      markProductReady,
      reset,
    }),
    [
      activeRunId,
      timeline,
      startRun,
      markCatalogFallback,
      markCatalogReady,
      markProductFallback,
      markParentAction,
      markProductReady,
      reset,
    ],
  )

  return <LoadingObservationContext.Provider value={value}>{children}</LoadingObservationContext.Provider>
}

export function useLoadingObservation() {
  const ctx = useContext(LoadingObservationContext)
  if (!ctx) {
    throw new Error('useLoadingObservation must be used within LoadingObservationProvider')
  }
  return ctx
}
