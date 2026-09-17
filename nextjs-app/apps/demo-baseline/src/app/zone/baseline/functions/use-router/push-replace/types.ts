export const ROOT_PATH = '/zone/baseline/functions/use-router/push-replace'
export const COMPLETE_PATH = `${ROOT_PATH}/orders/complete`

/** sessionStorage에 실제 내비게이션 직전 상태를 기록해 두는 키 */
export const NAV_LOG_STORAGE_KEY = 'demo:use-router:push-replace:nav-log'

/** 이 데모에서 다루는 프로그래밍 방식 내비게이션 메서드 */
export type NavMethod = 'push' | 'replace' | 'back'

/**
 * router.push/replace/back을 호출하기 직전에 남기는 기록.
 * 도착한 페이지가 이 기록과 자신의 실제 history.length를 비교해 검증한다.
 */
export interface NavigationLogEntry {
  method: NavMethod
  from: string
  to: string
  /** 이동을 트리거하기 직전에 측정한 window.history.length */
  historyLengthBeforeNav: number
  timestamp: number
}

export const PRODUCT = {
  id: 'prod-2109',
  name: '프리미엄 노트북 슬리브 백팩',
  price: 129000,
  description: '16인치 노트북 전용 완충 격벽과 방수 원단을 적용한 데일리 백팩',
}
