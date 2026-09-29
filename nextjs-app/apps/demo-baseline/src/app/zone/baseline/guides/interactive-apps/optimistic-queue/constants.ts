import type { LayoutGroup } from './types'

/** 서버 Action 안에서만 적용하는 저장 지연(관찰용). 화면에도 같은 값을 표시한다. */
export const SAVE_DELAY_MS = 1200

export const INITIAL_LAYOUT: LayoutGroup[] = [
  {
    name: '채널',
    channels: [
      { id: 'general', name: '#general' },
      { id: 'random', name: '#random' },
      { id: 'frontend', name: '#frontend' },
      { id: 'design', name: '#design' },
    ],
  },
  { name: '즐겨찾기', channels: [] },
  { name: '보관', channels: [] },
]
