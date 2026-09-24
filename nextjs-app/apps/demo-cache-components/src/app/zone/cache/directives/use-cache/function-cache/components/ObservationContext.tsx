'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Observation, RequestObservation } from '../types'

interface ObservationStore {
  observations: Observation[]
  report: (obs: RequestObservation) => void
  reset: () => void
}

const ObservationContext = createContext<ObservationStore | null>(null)

/** 서버가 요청마다 보내 준 관측값(RSC 페이로드)을 요청 ID 기준으로 한 번씩 기록한다. 값을 만들지 않는다. */
export function ObservationProvider({ children }: { children: React.ReactNode }) {
  const [observations, setObservations] = useState<Observation[]>([])

  const report = useCallback((obs: RequestObservation) => {
    setObservations((prev) =>
      prev.some((p) => p.requestId === obs.requestId) ? prev : [...prev, { ...obs, seq: (prev.at(-1)?.seq ?? 0) + 1 }],
    )
  }, [])
  const reset = useCallback(() => setObservations([]), [])

  return <ObservationContext.Provider value={{ observations, report, reset }}>{children}</ObservationContext.Provider>
}

export function useObservations(): ObservationStore {
  const ctx = useContext(ObservationContext)
  if (!ctx) throw new Error('ObservationProvider 안에서만 사용할 수 있습니다.')
  return ctx
}

export function RequestReporter({ observation }: { observation: RequestObservation }) {
  const { report } = useObservations()
  useEffect(() => {
    report(observation)
    // observation은 RSC 페이로드마다 새 객체이므로 요청 ID로만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observation.requestId, report])
  return null
}
