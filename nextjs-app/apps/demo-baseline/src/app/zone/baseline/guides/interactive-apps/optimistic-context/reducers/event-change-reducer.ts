import { DAYS } from '../constants'
import type { BoardEvent, EventChange } from '../types'

/** 서버 Action과 클라이언트(뷰별 재적용)가 함께 쓰는 순수 함수. */
export function eventChangeReducer(events: BoardEvent[], change: EventChange): BoardEvent[] {
  switch (change.type) {
    case 'create':
      return [...events.filter((e) => e.id !== change.event.id), change.event]
    case 'delete':
      return events.filter((e) => e.id !== change.id)
    case 'move':
      if (!DAYS.includes(change.day)) return events
      return events.map((e) => (e.id === change.id ? { ...e, day: change.day } : e))
    case 'resize': {
      const duration = Math.min(4, Math.max(1, change.duration))
      return events.map((e) => (e.id === change.id ? { ...e, duration } : e))
    }
  }
}

export function targetIdOf(change: EventChange): string {
  return change.type === 'create' ? change.event.id : change.id
}

/** 검증 비교용: 순서와 무관하게 같은 내용이면 같은 문자열 */
export function describeEvents(events: BoardEvent[]): string {
  return [...events]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => `${e.title} · ${e.day} ${e.start}시 · ${e.duration}h`)
    .join('\n') || '(이벤트 없음)'
}
