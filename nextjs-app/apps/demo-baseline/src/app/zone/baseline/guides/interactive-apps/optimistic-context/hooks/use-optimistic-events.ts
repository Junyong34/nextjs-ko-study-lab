'use client'

import { useEventsState } from '../providers/EventsProvider'
import { eventChangeReducer } from '../reducers/event-change-reducer'
import type { BoardEvent } from '../types'

/** 뷰가 받은 서버 이벤트 위에 대기 중인 변경을 순서대로 재적용한다. */
export function useOptimisticEvents(events: BoardEvent[]): BoardEvent[] {
  const { pendingChanges } = useEventsState()
  return pendingChanges.reduce(eventChangeReducer, events)
}
