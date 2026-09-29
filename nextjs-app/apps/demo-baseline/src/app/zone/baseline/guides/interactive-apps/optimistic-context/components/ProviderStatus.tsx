'use client'

import { useRef } from 'react'
import { useEventsDispatch, useEventsState } from '../providers/EventsProvider'

/**
 * Context 값이 바뀌어 이 컴포넌트가 새 값을 받은 횟수.
 * 같은 값으로 렌더가 두 번 호출되는 Strict Mode 개발 모드에서도 한 번으로 센다.
 */
function useValueChanges(value: unknown) {
  const last = useRef<unknown>(undefined)
  const count = useRef(0)
  if (last.current !== value) {
    last.current = value
    count.current += 1
  }
  return count.current
}

function StateProbe() {
  const state = useEventsState()
  const changes = useValueChanges(state)
  return (
    <p data-testid="state-probe">
      상태 Context 소비자: 새 값 <strong>{changes}</strong>회
    </p>
  )
}

function DispatchProbe() {
  const dispatch = useEventsDispatch()
  const changes = useValueChanges(dispatch)
  return (
    <p data-testid="dispatch-probe">
      디스패치 Context 소비자: 새 값 <strong>{changes}</strong>회
    </p>
  )
}

export function ProviderStatus() {
  const { isPending, pendingChanges, lastError, stableDispatch } = useEventsState()
  const { setStableDispatch } = useEventsDispatch()

  return (
    <div className="space-y-2 rounded-md border border-zinc-200 p-3 text-xs dark:border-zinc-800">
      <p data-testid="pending-status">
        {isPending ? '저장 진행 중' : '대기'} · 대기 중인 변경 <strong>{pendingChanges.length}</strong>건
      </p>
      {lastError && (
        <p role="alert" className="rounded bg-rose-50 px-2 py-1 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {lastError}
        </p>
      )}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-zinc-600 dark:text-zinc-400">
        <StateProbe />
        <DispatchProbe />
      </div>
      <label className="flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={stableDispatch}
          onChange={(e) => setStableDispatch(e.target.checked)}
        />
        <code>mutate</code> 참조를 <code>useCallback</code>으로 안정화
      </label>
    </div>
  )
}
