'use client'

import { useRef } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { resetEvents } from '../actions'
import { useEventsDispatch } from '../providers/EventsProvider'

export function NewEventButton() {
  const { mutate } = useEventsDispatch()
  const count = useRef(0)

  return (
    <button
      type="button"
      onClick={() => {
        count.current += 1
        mutate({
          type: 'create',
          event: { id: crypto.randomUUID(), title: `새 이벤트 ${count.current}`, day: '월', start: 9, duration: 1 },
        })
      }}
      className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
    >
      + 새 이벤트
    </button>
  )
}

export function ResetControl() {
  const { resetLog } = useEventsDispatch()
  return (
    <DemoResetButton
      onReset={async () => {
        await resetEvents()
        resetLog()
      }}
    />
  )
}
