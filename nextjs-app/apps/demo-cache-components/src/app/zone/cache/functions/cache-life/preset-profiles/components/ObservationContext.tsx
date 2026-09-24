'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { Observation, RequestSnapshot } from '../types'

interface ObservationStore {
  observations: Observation[]
  report: (snapshot: RequestSnapshot) => void
  reset: () => void
}

const ObservationContext = createContext<ObservationStore | null>(null)

/** 서버가 RSC 페이로드로 보내 준 요청별 스냅샷을 순서대로 모은다. 값을 만들지 않고 수집만 한다. */
export function ObservationProvider({ children }: { children: React.ReactNode }) {
  const [observations, setObservations] = useState<Observation[]>([])
  const recorded = useRef(new Set<string>())

  const report = useCallback((snapshot: RequestSnapshot) => {
    if (recorded.current.has(snapshot.requestId)) return
    recorded.current.add(snapshot.requestId)
    setObservations((prev) => [...prev, { ...snapshot, seq: prev.length + 1 }])
  }, [])
  const reset = useCallback(() => setObservations([]), [])

  return (
    <ObservationContext.Provider value={{ observations, report, reset }}>{children}</ObservationContext.Provider>
  )
}

export function useObservations(): ObservationStore {
  const ctx = useContext(ObservationContext)
  if (!ctx) throw new Error('ObservationProvider 안에서만 사용할 수 있습니다.')
  return ctx
}

/** 서버 컴포넌트(PresetBoard)가 렌더한 스냅샷을 관측 기록에 넘기는 보고용 컴포넌트 */
export function SnapshotReporter({ snapshot }: { snapshot: RequestSnapshot }) {
  const { report } = useObservations()
  useEffect(() => {
    report(snapshot)
    // snapshot은 RSC 페이로드마다 새 객체이므로 요청 ID로만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.requestId, report])
  return null
}
