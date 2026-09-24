'use client'

import React, { useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import {
  invalidateAction,
  queryCategoryAction,
  querySummaryAction,
  raisePriceAction,
  resetDemoAction,
} from '../actions'
import type { Category, Currency, DbSnapshot, TimelineEvent } from '../types'
import { QueryControls } from './QueryControls'
import { DbTablePanel } from './DbTablePanel'
import { CallTimeline } from './CallTimeline'
import { VerificationPanel } from './VerificationPanel'

type NewEvent =
  | Omit<Extract<TimelineEvent, { type: 'call' }>, 'seq'>
  | Omit<Extract<TimelineEvent, { type: 'invalidate' }>, 'seq'>
  | Omit<Extract<TimelineEvent, { type: 'write' }>, 'seq'>

export function DbQueryWorkbench({ initialSnapshot }: { initialSnapshot: DbSnapshot }) {
  const [snap, setSnap] = useState(initialSnapshot)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const push = (event: NewEvent) =>
    setEvents((prev) => [...prev, { ...event, seq: (prev.at(-1)?.seq ?? 0) + 1 } as TimelineEvent])

  const run = (task: () => Promise<void>) => {
    setError(null)
    startTransition(async () => {
      try {
        await task()
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })
  }

  const onQuery = (category: Category) =>
    run(async () => {
      const res = await queryCategoryAction(category)
      setSnap(res.snapshot)
      push({ type: 'call', record: res.data })
    })

  const onSummary = (currency: Currency, includeInKey: boolean) =>
    run(async () => {
      const res = await querySummaryAction(currency, includeInKey)
      setSnap(res.snapshot)
      push({ type: 'call', record: res.data })
    })

  const onInvalidate = (scope: Category | 'all') =>
    run(async () => {
      const res = await invalidateAction(scope)
      setSnap(res.snapshot)
      push({ type: 'invalidate', scope, tag: res.data, atIso: new Date().toISOString() })
    })

  const onRaise = (category: Category) =>
    run(async () => {
      const res = await raisePriceAction(category)
      setSnap(res.snapshot)
      push({ type: 'write', productId: res.data.productId, newPrice: res.data.newPrice, atIso: new Date().toISOString() })
    })

  const onReset = async () => {
    setSnap(await resetDemoAction())
    setEvents([])
    setError(null)
  }

  return (
    <>
      <DemoPlaygroundCard title="unstable_cache로 감싼 상품 조회 쿼리와 무효화">
        <div className="space-y-4">
          <QueryControls
            disabled={isPending}
            onQuery={onQuery}
            onSummary={onSummary}
            onInvalidate={onInvalidate}
            onRaise={onRaise}
          />
          <p className="text-[11px] text-zinc-500" aria-live="polite">
            {isPending
              ? 'Server Action 실행 중...'
              : '모든 버튼은 Server Action입니다. 판정(MISS/HIT/STALE)은 캐시 함수 호출 전후의 서버 쿼리 카운터와, 함수 본문이 기록한 runId로 계산합니다.'}
          </p>
          {error && <p className="text-[11px] text-rose-600">액션 오류: {error}</p>}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <DbTablePanel snapshot={snap} />
            <CallTimeline events={events} />
          </div>
          <div className="flex justify-end">
            <DemoResetButton
              label="DB·기록 초기화"
              onReset={onReset}
              title="테이블을 시드로 되돌리고 updateTag로 이 데모의 전체 태그를 만료합니다"
            />
          </div>
        </div>
      </DemoPlaygroundCard>
      <VerificationPanel events={events} isPending={isPending} />
    </>
  )
}
