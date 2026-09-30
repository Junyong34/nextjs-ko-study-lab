export type SlotName = 'children' | 'cart' | 'promo' | 'side'
export type Screens = Partial<Record<SlotName, string>>

/** 브라우저에 실제로 그려진 DOM에서 읽은 슬롯 상태 */
export interface Snapshot {
  path: string
  via: 'load' | 'soft'
  screens: Screens
  previousScreens?: Screens
}

/** 하드 로드와 같은 방식(전체 문서 GET)으로 받은 응답에서 읽은 값 */
export interface Probe {
  path: string
  status: number
  screens: Screens
}

export type CheckState = 'wait' | 'pass' | 'fail'
export interface Check {
  id: 'soft' | 'hard' | 'strict'
  label: string
  expected: string
  state: CheckState
  actual: string
}
