'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { CachedRenderInfo, Observation, RequestInfo } from '../types'

interface ObservationStore {
  observations: Observation[]
  reportCached: (info: CachedRenderInfo) => void
  reportRequest: (info: RequestInfo) => void
  reset: () => void
}

const ObservationContext = createContext<ObservationStore | null>(null)

/**
 * 서버가 실제로 보내 준 값(캐시된 JSX 안의 값 + children 슬롯의 값)을 요청 단위로 짝지어 기록한다.
 * 값을 만들지 않고, 서버 RSC 페이로드에 담겨 온 값을 수집만 한다.
 */
export function ObservationProvider({ children }: { children: React.ReactNode }) {
  const [latestCached, setLatestCached] = useState<CachedRenderInfo | null>(null)
  const [latestRequest, setLatestRequest] = useState<RequestInfo | null>(null)
  const [observations, setObservations] = useState<Observation[]>([])
  const recorded = useRef(new Set<string>())

  useEffect(() => {
    if (!latestCached || !latestRequest) return
    if (latestCached.category !== latestRequest.category) return
    if (recorded.current.has(latestRequest.requestId)) return
    recorded.current.add(latestRequest.requestId)
    setObservations((prev) => [
      ...prev,
      { ...latestCached, ...latestRequest, seq: prev.length + 1 },
    ])
  }, [latestCached, latestRequest])

  const reportCached = useCallback((info: CachedRenderInfo) => setLatestCached(info), [])
  const reportRequest = useCallback((info: RequestInfo) => setLatestRequest(info), [])
  const reset = useCallback(() => {
    // 현재 화면의 요청은 기록된 상태로 남겨 두고, 이후 요청부터 새로 수집한다.
    setObservations([])
  }, [])

  return (
    <ObservationContext.Provider value={{ observations, reportCached, reportRequest, reset }}>
      {children}
    </ObservationContext.Provider>
  )
}

export function useObservations(): ObservationStore {
  const ctx = useContext(ObservationContext)
  if (!ctx) throw new Error('ObservationProvider 안에서만 사용할 수 있습니다.')
  return ctx
}

/** 'use cache' 컴포넌트가 렌더한 JSX 안에 들어가는 보고용 컴포넌트 (캐시 HIT이면 예전 props가 그대로 온다) */
export function CachedRenderReporter({ info }: { info: CachedRenderInfo }) {
  const { reportCached } = useObservations()
  useEffect(() => {
    reportCached(info)
    // info는 RSC 페이로드마다 새 객체이므로 식별 값으로만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.renderId, info.category, reportCached])
  return null
}

/** children 슬롯(캐시 밖) 안에 들어가는 보고용 컴포넌트 */
export function RequestReporter({ info }: { info: RequestInfo }) {
  const { reportRequest } = useObservations()
  useEffect(() => {
    reportRequest(info)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.requestId, reportRequest])
  return null
}
