/** Drawer를 어디에 두었는가 — 이 데모가 대조하는 세 가지 배치 */
export type DrawerSlot = 'layout' | 'keyed' | 'page'

/** 각 Drawer 인스턴스가 자기 effect에서 보고하는 실측값 */
export interface DrawerReport {
  slot: DrawerSlot
  /** 인스턴스가 마운트될 때 한 번 만든 ID. 리마운트되면 바뀐다. */
  mountId: string
  /** 보고 시점의 usePathname() */
  pathname: string
  open: boolean
  memo: string
  /** 목록 DOM 요소의 실제 scrollTop(px, 반올림) */
  scrollTop: number
}

export type DrawerReports = Partial<Record<DrawerSlot, DrawerReport>>

/** 세 Drawer가 모두 같은 경로에서 보고를 마친 시점의 스냅샷 */
export interface PlacementSnapshot {
  pathname: string
  /** performance.timeOrigin — 문서가 새로 로드되면 바뀐다 */
  timeOrigin: number
  drawers: Record<DrawerSlot, DrawerReport>
}

export type SlotExpectation = 'preserve' | 'reset'

export interface SlotVerdict {
  slot: DrawerSlot
  expectation: SlotExpectation
  ok: boolean
  detail: string
}

export interface PlacementVerification {
  isMatched: boolean | undefined
  reason: string
  slots: SlotVerdict[]
}
