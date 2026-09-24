'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { LayoutReport, PageReport, Transition } from '../types'
import type { PairedEvidence } from '../verification'

interface ObservationContextValue {
  latestLayout: LayoutReport | null
  sameCategory: Transition | null
  categoryChange: Transition | null
  itemEvidence: PairedEvidence | null
  queryEvidence: PairedEvidence | null
  reportLayout: (report: LayoutReport) => void
  reportPage: (report: PageReport) => void
}

const ObservationContext = createContext<ObservationContextValue | undefined>(undefined)

/**
 * [category] 바깥의 정적 layout.tsx에 놓이는 기록 장치.
 * [category]/layout.tsx는 category 값이 바뀌면 다시 마운트되므로, 이동 전후 값을 비교하려면
 * 그보다 한 단계 위(이 Provider)에 기록을 남겨야 한다.
 */
export function ObservationProvider({ children }: { children: React.ReactNode }) {
  const lastLayout = useRef<LayoutReport | null>(null)
  const lastPage = useRef<PageReport | null>(null)
  const [latestLayout, setLatestLayout] = useState<LayoutReport | null>(null)
  const [sameCategory, setSameCategory] = useState<Transition | null>(null)
  const [categoryChange, setCategoryChange] = useState<Transition | null>(null)
  const [itemEvidence, setItemEvidence] = useState<PairedEvidence | null>(null)
  const [queryEvidence, setQueryEvidence] = useState<PairedEvidence | null>(null)

  const pair = useCallback((layout: LayoutReport | null, page: PageReport | null) => {
    if (!layout || !page || layout.pathname !== page.pathname) return
    const pageParams = JSON.parse(page.paramsJson) as Record<string, unknown>
    if ('item' in pageParams) setItemEvidence({ layout, page })
    if (page.searchParamsJson !== '{}') setQueryEvidence({ layout, page })
  }, [])

  const reportLayout = useCallback(
    (report: LayoutReport) => {
      const prev = lastLayout.current
      lastLayout.current = report
      setLatestLayout(report)
      if (prev && prev.location !== report.location) {
        const transition = { from: prev, to: report }
        if (prev.category === report.category) setSameCategory(transition)
        else setCategoryChange(transition)
      }
      pair(report, lastPage.current)
    },
    [pair],
  )

  const reportPage = useCallback(
    (report: PageReport) => {
      lastPage.current = report
      pair(lastLayout.current, report)
    },
    [pair],
  )

  const value = useMemo(
    () => ({ latestLayout, sameCategory, categoryChange, itemEvidence, queryEvidence, reportLayout, reportPage }),
    [latestLayout, sameCategory, categoryChange, itemEvidence, queryEvidence, reportLayout, reportPage],
  )

  return <ObservationContext.Provider value={value}>{children}</ObservationContext.Provider>
}

export function useObservation() {
  const ctx = useContext(ObservationContext)
  if (!ctx) throw new Error('useObservation must be used within ObservationProvider')
  return ctx
}
