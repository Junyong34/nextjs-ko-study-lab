'use server'

import { revalidatePath } from 'next/cache'
import { INITIAL_EVENTS, PAGE_PATH, SAVE_DELAY_MS } from './constants'
import { eventChangeReducer, targetIdOf } from './reducers/event-change-reducer'
import type { BoardEvent, EventChange, SaveResult } from './types'

// 서버 메모리 저장소. 모든 방문자가 공유하며 재시작·다중 인스턴스에서는 유지되지 않는다.
let savedEvents: BoardEvent[] = structuredClone(INITIAL_EVENTS)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getSavedEvents(): Promise<BoardEvent[]> {
  return savedEvents
}

/** 변경 하나를 저장한다. 관찰용 지연은 서버 안에서만 넣는다. */
export async function saveEventChange(change: EventChange): Promise<SaveResult> {
  await sleep(SAVE_DELAY_MS)
  const target = savedEvents.find((e) => e.id === targetIdOf(change))
  if (target?.readOnly) {
    return { error: `"${target.title}"은(는) 읽기 전용이라 서버가 변경을 거부했습니다.` }
  }
  savedEvents = eventChangeReducer(savedEvents, change)
  revalidatePath(PAGE_PATH)
  return {}
}

export async function resetEvents(): Promise<void> {
  savedEvents = structuredClone(INITIAL_EVENTS)
  revalidatePath(PAGE_PATH)
}
