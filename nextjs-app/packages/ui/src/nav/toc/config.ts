/** ScrollSpy 위치 계산 상수. */
export const SCROLLSPY_CONFIG = {
  /** 페이지 최상단 감지 임계값 (px) */
  TOP_THRESHOLD: 50,
  /** 페이지 바닥 감지 오차 (px) */
  BOTTOM_THRESHOLD: 60,
  /** `scroll-mt-24`(96px)와 맞춘 상단 기준선 오프셋 (px) */
  HEADER_OFFSET: 100,
  /** 클릭으로 부드럽게 이동하는 동안 감지를 잠그는 시간 (ms) */
  CLICK_LOCK_DURATION: 600,
} as const

export const ALL_ALPHABETS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
]

/** 목차가 받는 헤딩 항목. 파싱은 `@study/docs-render`가 한다. */
export interface HeadingItem {
  id: string
  alias?: string
  text: string
  level: number
  isLetter?: boolean
  letter?: string
}
