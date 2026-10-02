'use client'
import { useCallback, useRef, useState } from 'react'
import type { Recorder } from '../lib/client-api'
import type { LabEvent } from '../types'

const MAX_EVENTS = 200

/** fetch·PATCH·화면 표시 변화를 한 시간축(performance.now 기준 ms)에 기록한다. 전역 fetch는 건드리지 않는다. */
export function useEventLog() {
  const [events, setEvents] = useState<LabEvent[]>([])
  const epoch = useRef<number | null>(null)
  const seq = useRef(0)

  const now = useCallback(() => {
    epoch.current ??= performance.now()
    return Math.round(performance.now() - epoch.current)
  }, [])

  const record = useCallback<Recorder>(
    (e) => {
      const t = now()
      seq.current += 1
      const event: LabEvent = { ...e, seq: seq.current, t }
      setEvents((prev) => [...prev, event].slice(-MAX_EVENTS))
    },
    [now]
  )

  const clear = useCallback(() => {
    setEvents([])
    seq.current = 0
    epoch.current = null
  }, [])

  return { events, record, now, clear }
}

export type EventLog = ReturnType<typeof useEventLog>
