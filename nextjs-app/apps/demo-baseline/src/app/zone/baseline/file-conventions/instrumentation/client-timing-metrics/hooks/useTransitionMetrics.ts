'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  CLIENT_TIMING_COMPLETE_EVENT,
  CLIENT_TIMING_START_EVENT,
  type ClientTimingTransitionRecord,
} from '@/instrumentation-client'

function readTransitions(): ClientTimingTransitionRecord[] {
  if (typeof window === 'undefined') return []
  return window.__clientTimingMetricsDemo?.transitions ?? []
}

/**
 * instrumentation-client.ts가 window.__clientTimingMetricsDemo에 쌓은 실제 라우터 전환
 * 기록을 구독하고, 이 훅을 호출한 페이지가 방금 마운트됐다는 사실 자체로 "도착"을 기록한다.
 * (직전 onRouterTransitionStart 이후 처음 그려지는 페이지의 마운트 시각이 전환 완료 시각이다.)
 */
export function useTransitionMetrics() {
  const [transitions, setTransitions] = useState<ClientTimingTransitionRecord[]>([])

  const sync = useCallback(() => {
    setTransitions([...readTransitions()].reverse())
  }, [])

  useEffect(() => {
    // 이 컴포넌트가 마운트된 시점 = 직전 라우터 전환의 실제 도착 시점.
    window.__clientTimingMetricsDemo?.recordArrival()
    sync()

    window.addEventListener(CLIENT_TIMING_START_EVENT, sync)
    window.addEventListener(CLIENT_TIMING_COMPLETE_EVENT, sync)
    return () => {
      window.removeEventListener(CLIENT_TIMING_START_EVENT, sync)
      window.removeEventListener(CLIENT_TIMING_COMPLETE_EVENT, sync)
    }
  }, [sync])

  return { transitions }
}
