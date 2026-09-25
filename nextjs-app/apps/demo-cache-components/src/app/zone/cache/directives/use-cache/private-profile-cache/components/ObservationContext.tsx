'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  OBSERVATION_STORAGE_KEY,
  formatTime,
  type ExecCheck,
  type ExecCountResult,
  type ProbeResult,
  type VisitObservation,
} from '../types'

// 이 모듈이 브라우저에 로드될 때 한 번 만들어진다. 새로고침(문서 재로드)하면 새 값이 된다.
const PAGE_LOAD_ID = Math.random().toString(36).slice(2, 6).toUpperCase()

type NewVisit = Omit<VisitObservation, 'seq' | 'pageLoadId' | 'shownAt'>

interface ObservationStore {
  /** 서버 렌더와 값이 달라 하이드레이션 이후에만 채워진다 */
  pageLoadId: string | null
  visits: VisitObservation[]
  execChecks: ExecCheck[]
  probe: ProbeResult | null
  recordVisit: (visit: NewVisit) => void
  recordExecCheck: (result: ExecCountResult) => void
  setProbe: (result: ProbeResult) => void
  reset: () => void
}

const ObservationContext = createContext<ObservationStore | null>(null)

interface Stored {
  visits: VisitObservation[]
  execChecks: ExecCheck[]
}

function loadStored(): Stored {
  try {
    const raw = sessionStorage.getItem(OBSERVATION_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<Stored>) : {}
    return {
      visits: (parsed.visits ?? []).filter((v) => v.pageLoadId !== PAGE_LOAD_ID),
      execChecks: (parsed.execChecks ?? []).filter((c) => c.pageLoadId !== PAGE_LOAD_ID),
    }
  } catch {
    // sessionStorage를 쓸 수 없는 환경이면 새로고침 비교만 건너뛴다.
    return { visits: [], execChecks: [] }
  }
}

/** 화면에 나타난 서버 값(cacheId 등)을 그대로 기록한다. 값을 만들지 않는다. */
export function ObservationProvider({ children }: { children: React.ReactNode }) {
  const [visits, setVisits] = useState<VisitObservation[]>([])
  const [execChecks, setExecChecks] = useState<ExecCheck[]>([])
  const [probe, setProbe] = useState<ProbeResult | null>(null)
  const [pageLoadId, setPageLoadId] = useState<string | null>(null)

  useEffect(() => {
    setPageLoadId(PAGE_LOAD_ID)
    // 새로고침 이전 문서에서 남긴 기록을 앞에 붙이고, 이번 문서의 기록 번호를 그 뒤로 잇는다.
    const stored = loadStored()
    if (stored.visits.length === 0 && stored.execChecks.length === 0) return
    const base = stored.visits.at(-1)?.seq ?? 0
    setVisits((prev) => [...stored.visits, ...prev.map((v, i) => ({ ...v, seq: base + i + 1 }))])
    setExecChecks((prev) => [...stored.execChecks, ...prev])
  }, [])

  useEffect(() => {
    try {
      const data: Stored = { visits: visits.slice(-40), execChecks: execChecks.slice(-20) }
      sessionStorage.setItem(OBSERVATION_STORAGE_KEY, JSON.stringify(data))
    } catch {
      // 저장 실패는 무시한다 (기록은 현재 문서 안에서만 유지).
    }
  }, [visits, execChecks])

  const recordVisit = useCallback((visit: NewVisit) => {
    setVisits((prev) => {
      const last = prev.at(-1)
      // 연속 중복(같은 문서·라우트·cacheId)은 같은 화면이므로 한 번만 남긴다 (dev StrictMode의 이중 effect 포함).
      if (last && last.pageLoadId === PAGE_LOAD_ID && last.route === visit.route && last.cacheId === visit.cacheId) {
        return prev
      }
      return [
        ...prev,
        { ...visit, seq: (last?.seq ?? 0) + 1, pageLoadId: PAGE_LOAD_ID, shownAt: formatTime(new Date()) },
      ]
    })
  }, [])
  const lastSeq = visits.at(-1)?.seq ?? 0
  const recordExecCheck = useCallback(
    (r: ExecCountResult) => setExecChecks((prev) => [...prev, { ...r, afterSeq: lastSeq, pageLoadId: PAGE_LOAD_ID }]),
    [lastSeq],
  )
  const reset = useCallback(() => {
    setVisits([])
    setExecChecks([])
    setProbe(null)
  }, [])

  return (
    <ObservationContext.Provider
      value={{ pageLoadId, visits, execChecks, probe, recordVisit, recordExecCheck, setProbe, reset }}
    >
      {children}
    </ObservationContext.Provider>
  )
}

export function useObservations(): ObservationStore {
  const ctx = useContext(ObservationContext)
  if (!ctx) throw new Error('ObservationProvider 안에서만 사용할 수 있습니다.')
  return ctx
}
