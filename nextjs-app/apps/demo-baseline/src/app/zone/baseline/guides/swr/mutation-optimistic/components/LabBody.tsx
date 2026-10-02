'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useCartMutation } from '../hooks/useCartMutation'
import type { EventLog } from '../hooks/useEventLog'
import { CartBadge } from './CartBadge'
import { CartPanel } from './CartPanel'
import { ControlBar } from './ControlBar'
import { EventTimeline } from './EventTimeline'
import { VerificationFooter } from './VerificationFooter'

interface Props {
  log: EventLog
  onReset: () => Promise<void>
}

/** SWRConfig 안쪽. useSWRConfig().mutate가 이 데모 전용 캐시를 가리킨다. */
export function LabBody({ log, onReset }: Props) {
  const m = useCartMutation(log)

  const reset = async () => {
    m.reset()
    await onReset()
  }

  return (
    <>
      <DemoPlaygroundCard title="SWR 캐시를 공유하는 장바구니 실습">
        <div className="space-y-4">
          <ControlBar
            settings={m.settings}
            onSettings={m.setSettings}
            extraConsumers={m.extraConsumers}
            pending={m.pending}
            onAddConsumer={m.addConsumer}
            onReset={reset}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">장바구니</span>
            <div className="flex flex-wrap gap-1.5">
              <CartBadge label="헤더 배지" />
              {Array.from({ length: m.extraConsumers }, (_, i) => (
                <CartBadge key={i} label={`추가 구독 ${i + 1}`} />
              ))}
            </div>
          </div>
          <CartPanel record={log.record} disabled={m.pending} onChange={m.change} />
          <EventTimeline events={log.events} serverLog={m.serverLog} onRefreshServerLog={() => void m.refreshServerLog()} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter latest={m.latest} events={log.events} />
    </>
  )
}
