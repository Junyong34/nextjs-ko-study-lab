export type Day = '월' | '화' | '수' | '목' | '금'

export type BoardEvent = {
  id: string
  title: string
  day: Day
  /** 시작 시각(시) */
  start: number
  /** 길이(시간) */
  duration: number
  /** true면 서버가 변경을 거부한다(실패·롤백 관찰용) */
  readOnly?: boolean
}

export type EventChange =
  | { type: 'create'; event: BoardEvent }
  | { type: 'delete'; id: string }
  | { type: 'move'; id: string; day: Day }
  | { type: 'resize'; id: string; duration: number }

export type SaveResult = { error?: string }
