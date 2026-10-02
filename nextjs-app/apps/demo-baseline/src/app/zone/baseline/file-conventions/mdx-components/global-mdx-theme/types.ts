/** 전역 매핑 대상 요소 하나의 실측값 (getComputedStyle 기준) */
export interface ElementInfo {
  tag: string
  /** mdx-components.tsx가 붙이는 mdx-g class 여부 */
  globalClass: boolean
  fontSize: string
  fontWeight: string
  color: string
}

/** 같은 MDX를 두 방식으로 렌더한 영역을 한 번에 잰 결과 */
export interface PaneSnapshot {
  themeOn: boolean
  raw: ElementInfo[]
  mapped: ElementInfo[]
  measuredAt: string
}

export type ThemeKey = 'on' | 'off'
