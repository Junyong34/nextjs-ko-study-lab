'use client'

import { useEventsDispatch } from '../providers/EventsProvider'
import { DAYS } from '../constants'
import type { BoardEvent } from '../types'

const btn =
  'rounded border border-zinc-300 px-1.5 py-0.5 text-[11px] text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'

/** 이벤트 한 건과 조작 버튼. 변경을 보내기만 하므로 디스패치 Context만 읽는다. */
export function EventCard({ event, saving }: { event: BoardEvent; saving: boolean }) {
  const { mutate } = useEventsDispatch()
  const index = DAYS.indexOf(event.day)

  return (
    <li className="space-y-1 rounded border border-zinc-200 p-2 text-xs dark:border-zinc-800">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{event.title}</span>
        {saving && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
            저장 중
          </span>
        )}
      </div>
      <p className="text-zinc-500">
        {event.day}요일 {event.start}시 · {event.duration}시간
      </p>
      <div className="flex flex-wrap gap-1">
        <button type="button" className={btn} disabled={index === 0}
          onClick={() => mutate({ type: 'move', id: event.id, day: DAYS[index - 1] })}>◀ 하루 앞</button>
        <button type="button" className={btn} disabled={index === DAYS.length - 1}
          onClick={() => mutate({ type: 'move', id: event.id, day: DAYS[index + 1] })}>하루 뒤 ▶</button>
        <button type="button" className={btn} disabled={event.duration <= 1}
          onClick={() => mutate({ type: 'resize', id: event.id, duration: event.duration - 1 })}>−1h</button>
        <button type="button" className={btn} disabled={event.duration >= 4}
          onClick={() => mutate({ type: 'resize', id: event.id, duration: event.duration + 1 })}>+1h</button>
        <button type="button" className={btn}
          onClick={() => mutate({ type: 'delete', id: event.id })}>삭제</button>
      </div>
    </li>
  )
}
