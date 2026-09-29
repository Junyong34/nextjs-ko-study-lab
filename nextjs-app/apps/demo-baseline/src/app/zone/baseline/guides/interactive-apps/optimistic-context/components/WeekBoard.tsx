'use client'

import { DAYS } from '../constants'
import { useOptimisticEvents } from '../hooks/use-optimistic-events'
import type { BoardEvent } from '../types'
import { EventCard } from './EventCard'

/** 주간 뷰: 서버가 준 events 위에 pendingChanges를 재적용해 그린다. */
export function WeekBoard({ events }: { events: BoardEvent[] }) {
  const shown = useOptimisticEvents(events)
  const isSaved = (e: BoardEvent) =>
    events.some((s) => s.id === e.id && s.day === e.day && s.start === e.start && s.duration === e.duration)

  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {DAYS.map((day) => (
        <section key={day} aria-label={`${day}요일`} className="space-y-2">
          <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{day}</h4>
          <ul className="space-y-2">
            {shown
              .filter((e) => e.day === day)
              .sort((a, b) => a.start - b.start)
              .map((e) => (
                <EventCard key={e.id} event={e} saving={!isSaved(e)} />
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
