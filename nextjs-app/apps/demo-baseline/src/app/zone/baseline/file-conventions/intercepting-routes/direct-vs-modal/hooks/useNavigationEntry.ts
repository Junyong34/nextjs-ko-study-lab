'use client'

import { useEffect, useState } from 'react'
import type { NavigationSignal } from '../types'

/**
 * 브라우저의 실제 Navigation Timing API(`performance.getEntriesByType('navigation')`)를 읽어
 * 이 문서가 "처음부터 이 경로로 요청되었는지"를 실측한다.
 *
 * - 링크 클릭(소프트 내비게이션)으로 도달한 경우: 브라우저는 새 문서를 요청하지 않으므로
 *   navigation entry는 최초 페이지 로드 시점 그대로 남는다 → entry 경로 !== 현재 경로.
 * - 새로고침/주소창 직접 입력(하드 내비게이션)으로 도달한 경우: 브라우저가 이 경로로
 *   새 문서를 요청하므로 navigation entry의 경로가 현재 경로와 일치한다.
 *
 * useState 토글이 아니라 브라우저가 실제로 기록한 값을 읽으므로 조작 불가능한 실측 신호다.
 */
export function useNavigationEntry(currentPath: string): NavigationSignal {
  const [signal, setSignal] = useState<NavigationSignal>({
    navigationType: null,
    documentEntryPath: null,
    currentPath,
    isHardNavigation: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return

    try {
      const entries = window.performance.getEntriesByType(
        'navigation',
      ) as PerformanceNavigationTiming[]
      const entry = entries[0]
      if (!entry) return

      const documentEntryPath = new URL(entry.name).pathname
      setSignal({
        navigationType: entry.type,
        documentEntryPath,
        currentPath,
        isHardNavigation: documentEntryPath === currentPath,
      })
    } catch {
      // Navigation Timing API를 사용할 수 없는 환경 — 측정 불가 상태(null)로 유지
    }
  }, [currentPath])

  return signal
}
