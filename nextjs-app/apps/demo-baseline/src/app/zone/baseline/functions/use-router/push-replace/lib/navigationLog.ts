import { NAV_LOG_STORAGE_KEY, type NavigationLogEntry, type NavMethod } from '../types'

/**
 * router.push/replace/back을 호출하기 직전, 실제 window.history.length를 sessionStorage에 남긴다.
 * 도착 페이지는 이 값과 자신의 history.length를 비교해 "히스토리 엔트리가 실제로 늘었는가"를 검증한다.
 */
export function recordNavigation(method: NavMethod, from: string, to: string) {
  const entry: NavigationLogEntry = {
    method,
    from,
    to,
    historyLengthBeforeNav: window.history.length,
    timestamp: Date.now(),
  }
  sessionStorage.setItem(NAV_LOG_STORAGE_KEY, JSON.stringify(entry))
}

/** 현재 pathname으로 도착하게 만든 직전 기록을 읽는다. 없거나 목적지가 다르면 null. */
export function readNavigationLog(currentPathname: string): NavigationLogEntry | null {
  const raw = sessionStorage.getItem(NAV_LOG_STORAGE_KEY)
  if (!raw) return null

  try {
    const entry = JSON.parse(raw) as NavigationLogEntry
    return entry.to === currentPathname ? entry : null
  } catch {
    return null
  }
}
