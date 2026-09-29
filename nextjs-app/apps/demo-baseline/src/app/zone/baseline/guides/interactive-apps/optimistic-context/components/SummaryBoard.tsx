'use client'

import { DAYS } from '../constants'
import { useOptimisticEvents } from '../hooks/use-optimistic-events'
import type { BoardEvent } from '../types'

/** 요약 뷰: 주간 뷰와 다른 컴포넌트지만 같은 훅으로 같은 낙관적 결과를 얻는다. */
export function SummaryBoard({ events }: { events: BoardEvent[] }) {
  const shown = useOptimisticEvents(events)

  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-left text-zinc-500">
          <th className="py-1 font-medium">요일</th>
          <th className="py-1 font-medium">건수</th>
          <th className="py-1 font-medium">총 시간</th>
        </tr>
      </thead>
      <tbody>
        {DAYS.map((day) => {
          const list = shown.filter((e) => e.day === day)
          return (
            <tr key={day} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="py-1">{day}</td>
              <td className="py-1" data-testid={`count-${day}`}>{list.length}건</td>
              <td className="py-1" data-testid={`hours-${day}`}>{list.reduce((s, e) => s + e.duration, 0)}h</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
