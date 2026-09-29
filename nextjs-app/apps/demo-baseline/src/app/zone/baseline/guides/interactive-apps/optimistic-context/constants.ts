import type { BoardEvent, Day } from './types'

export const DAYS: Day[] = ['월', '화', '수', '목', '금']

/** 서버 Action 안에서만 적용하는 저장 지연(관찰용). 화면에도 같은 값을 표시한다. */
export const SAVE_DELAY_MS = 1200

export const PAGE_PATH = '/zone/baseline/guides/interactive-apps/optimistic-context'

export const INITIAL_EVENTS: BoardEvent[] = [
  { id: 'e-plan', title: '기획 회의', day: '월', start: 10, duration: 2 },
  { id: 'e-review', title: '코드 리뷰', day: '화', start: 14, duration: 1 },
  { id: 'e-design', title: '디자인 싱크', day: '수', start: 11, duration: 1 },
  { id: 'e-demo', title: '데모 이벤트 (읽기 전용)', day: '목', start: 9, duration: 1, readOnly: true },
]
