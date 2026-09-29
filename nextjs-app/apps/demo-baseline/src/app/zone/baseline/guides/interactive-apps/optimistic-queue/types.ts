export type LayoutChannel = { id: string; name: string }
export type LayoutGroup = { name: string; channels: LayoutChannel[] }

/** 채널 하나를 다른 그룹의 맨 뒤로 옮기는 변경 */
export type LayoutChange = { type: 'move'; channelId: string; toGroup: string }

export type IssuedMove = { change: LayoutChange; failed: boolean }

export type LayoutMode = 'naive' | 'queued'

/** naive·queued 훅이 같은 모양으로 돌려주는 화면 모델 */
export type LayoutModel = {
  /** 화면에 그리는 값(낙관적 상태 포함) */
  shown: LayoutGroup[]
  /** 서버 저장이 확인된 값 */
  confirmed: LayoutGroup[]
  isPending: boolean
  error: string | null
  issued: IssuedMove[]
  move: (change: LayoutChange, injectFail: boolean) => void
}
