'use client'

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect, useRef } from 'react'
import type { StatePreservationBaseline } from '../types'
import { DEFAULT_QUERY, resetState } from '../verification'

interface StatePreservationContextValue {
  mountId: string
  query: string
  setQuery: (value: string) => void
  baseline: StatePreservationBaseline | null
  recordBaseline: (pathname: string) => void
  reset: () => void
  reportedPathname: string | null
  reportedCategory: string | null
  reportCategory: (pathname: string, category: string) => void
}

const StatePreservationContext = createContext<StatePreservationContextValue | undefined>(undefined)

function createMountId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `mount-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * 이 Provider의 React 상태(mountId·query·baseline)는 실제 layout.tsx 아래
 * 클라이언트 컴포넌트 인스턴스에 보관된다. 하위 page.tsx가 실제 Link 이동으로
 * 교체돼도 이 인스턴스는 리마운트되지 않으므로 값이 그대로 유지된다.
 */
export function StatePreservationProvider({ children }: { children: React.ReactNode }) {
  const [mountId, setMountId] = useState('')
  const mountedId = useRef<string | null>(null)
  useEffect(() => {
    // SSR와 첫 클라이언트 렌더는 동일하게 비워 두고, 마운트 후 관측 ID를 만든다.
    mountedId.current ??= createMountId()
    setMountId(mountedId.current)
  }, [])
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [baseline, setBaseline] = useState<StatePreservationBaseline | null>(null)
  const [reportedPathname, setReportedPathname] = useState<string | null>(null)
  const [reportedCategory, setReportedCategory] = useState<string | null>(null)

  const reportCategory = useCallback((pathname: string, category: string) => {
    setReportedPathname(pathname)
    setReportedCategory(category)
  }, [])

  const recordBaseline = useCallback(
    (pathname: string) => {
      if (!mountId || reportedPathname !== pathname || reportedCategory === null) return
      setBaseline({ query, pathname, category: reportedCategory, mountId })
    },
    [query, mountId, reportedPathname, reportedCategory],
  )

  const reset = useCallback(() => {
    const next = resetState()
    setQuery(next.query)
    setBaseline(next.baseline)
  }, [])

  const value = useMemo<StatePreservationContextValue>(
    () => ({
      mountId,
      query,
      setQuery,
      baseline,
      recordBaseline,
      reset,
      reportedPathname,
      reportedCategory,
      reportCategory,
    }),
    [mountId, query, baseline, recordBaseline, reset, reportedPathname, reportedCategory, reportCategory],
  )

  return <StatePreservationContext.Provider value={value}>{children}</StatePreservationContext.Provider>
}

export function useStatePreservation() {
  const ctx = useContext(StatePreservationContext)
  if (!ctx) {
    throw new Error('useStatePreservation must be used within StatePreservationProvider')
  }
  return ctx
}
