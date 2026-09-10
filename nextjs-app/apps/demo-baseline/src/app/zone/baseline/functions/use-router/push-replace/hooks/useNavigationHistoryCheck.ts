'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { readNavigationLog } from '../lib/navigationLog'
import type { NavigationLogEntry } from '../types'

export interface NavigationHistoryCheck {
  pathname: string
  entry: NavigationLogEntry | null
  historyLengthAfterNav: number | null
  /** push는 히스토리 엔트리가 1개 늘어야 하고, replace/back은 늘지 않아야 한다 */
  expectedDelta: number | null
  actualDelta: number | null
  isMatched: boolean | undefined
}

/**
 * router.push/replace/back 호출 직전 기록(navigationLog)과 현재 실제 window.history.length를 대조해
 * "이 이동이 브라우저 히스토리 스택에 실제로 엔트리를 추가했는가"를 검증한다.
 */
export function useNavigationHistoryCheck(): NavigationHistoryCheck {
  const pathname = usePathname()
  const [historyLengthAfterNav, setHistoryLengthAfterNav] = useState<number | null>(null)
  const [entry, setEntry] = useState<NavigationLogEntry | null>(null)

  useEffect(() => {
    setEntry(readNavigationLog(pathname))
    setHistoryLengthAfterNav(window.history.length)
  }, [pathname])

  const expectedDelta = entry ? (entry.method === 'push' ? 1 : 0) : null
  const actualDelta =
    entry && historyLengthAfterNav !== null ? historyLengthAfterNav - entry.historyLengthBeforeNav : null

  return {
    pathname,
    entry,
    historyLengthAfterNav,
    expectedDelta,
    actualDelta,
    isMatched: expectedDelta === null || actualDelta === null ? undefined : expectedDelta === actualDelta,
  }
}
