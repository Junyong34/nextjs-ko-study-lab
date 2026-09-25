export interface TargetItem {
  id: string
  title: string
  category: string
  price: number
  desc: string
  color: string
}

/** 이 라우트가 실제로 어떤 파일에서 렌더링되었는지 — 구조적 사실이며 UI 상태가 아니다. */
export type EntryMode = 'modal' | 'direct'

/** performance.getEntriesByType('navigation')[0] 에서 얻는 실측 내비게이션 신호 */
export interface NavigationSignal {
  /** PerformanceNavigationTiming.type: 'navigate' | 'reload' | 'back_forward' | 'prerender' */
  navigationType: string | null
  /** 브라우저가 실제로 문서를 요청한 최초 경로(pathname) */
  documentEntryPath: string | null
  /** 현재 렌더링 중인 라우트 경로(pathname) */
  currentPath: string
  /** documentEntryPath === currentPath → 하드 내비게이션(직접 진입/새로고침). 측정 전엔 null */
  isHardNavigation: boolean | null
}
