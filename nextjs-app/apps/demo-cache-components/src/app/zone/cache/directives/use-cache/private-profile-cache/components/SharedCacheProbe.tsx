'use client'

import { useTransition } from 'react'
import { probeSharedCacheCookies } from '../actions'
import { useObservations } from './ObservationContext'

/** 대조군: 일반 'use cache' 안에서 cookies()를 호출하는 함수를 Server Action으로 실제 실행한다. */
export function SharedCacheProbe() {
  const [isPending, startTransition] = useTransition()
  const { probe, setProbe } = useObservations()

  return (
    <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-amber-900 dark:text-amber-200">
          대조: 일반 <code>&apos;use cache&apos;</code> 안에서 <code>cookies()</code> 호출
        </span>
        <button
          type="button"
          data-testid="probe-shared"
          disabled={isPending}
          onClick={() => startTransition(async () => setProbe(await probeSharedCacheCookies()))}
          className="rounded-md border border-amber-300 bg-white px-3 py-1 font-medium text-amber-900 transition hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
        >
          {isPending ? '실행 중...' : 'getOrdersWithSharedCache() 실행'}
        </button>
      </div>
      {probe && (
        <pre data-testid="probe-result" className="whitespace-pre-wrap break-all rounded bg-zinc-900 p-2 font-mono text-[11px] text-zinc-100">
          {probe.ok
            ? `반환됨 (${probe.checkedAt}): ${probe.value}`
            : `${probe.name} (${probe.checkedAt})\n${probe.message}${probe.digest ? `\ndigest: ${probe.digest}` : ''}`}
        </pre>
      )}
    </div>
  )
}
