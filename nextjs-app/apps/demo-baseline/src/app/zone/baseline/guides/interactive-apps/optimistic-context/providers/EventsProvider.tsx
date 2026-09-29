'use client'

import {
  createContext,
  startTransition,
  useActionState,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useState,
  type ReactNode,
} from 'react'
import { saveEventChange } from '../actions'
import type { EventChange } from '../types'

type StateValue = {
  isPending: boolean
  pendingChanges: EventChange[]
  /** 지금까지 발행한 변경(초기화 전까지). 검증 패널이 사용한다. */
  issued: EventChange[]
  lastError: string | null
  stableDispatch: boolean
}

type DispatchValue = {
  mutate: (change: EventChange) => void
  resetLog: () => void
  setStableDispatch: (stable: boolean) => void
}

const StateContext = createContext<StateValue | null>(null)
const DispatchContext = createContext<DispatchValue | null>(null)

export function EventsProvider({ children }: { children: ReactNode }) {
  // 저장 큐: 상태는 마지막 오류 문자열. 콜백이 끝나야 다음 변경이 시작된다.
  const [lastError, dispatch, isPending] = useActionState(
    async (_prev: string | null, change: EventChange) => {
      const result = await saveEventChange(change)
      return result.error ?? null
    },
    null,
  )
  // 서버 데이터가 아니라 "변경 목록"을 낙관적으로 쌓는다. 서버 데이터는 각 뷰가 받는다.
  const [pendingChanges, addOptimisticChange] = useOptimistic<EventChange[], EventChange>(
    [],
    (changes, change) => [...changes, change],
  )
  const [issued, setIssued] = useState<EventChange[]>([])
  const [stableDispatch, setStableDispatch] = useState(true)

  const stableMutate = useCallback(
    (change: EventChange) => {
      setIssued((list) => [...list, change])
      startTransition(() => {
        addOptimisticChange(change)
        dispatch(change)
      })
    },
    [addOptimisticChange, dispatch],
  )
  // 비교용: 참조를 안정화하지 않으면 렌더마다 새 함수가 만들어진다.
  const unstableMutate = (change: EventChange) => stableMutate(change)
  const mutate = stableDispatch ? stableMutate : unstableMutate
  const resetLog = useCallback(() => setIssued([]), [])

  const stateValue: StateValue = {
    isPending,
    pendingChanges,
    issued,
    lastError: issued.length > 0 ? lastError : null,
    stableDispatch,
  }
  const dispatchValue = useMemo(
    () => ({ mutate, resetLog, setStableDispatch }),
    [mutate, resetLog],
  )

  return (
    <StateContext.Provider value={stateValue}>
      <DispatchContext.Provider value={dispatchValue}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useEventsState() {
  const value = useContext(StateContext)
  if (!value) throw new Error('useEventsState는 EventsProvider 안에서만 쓸 수 있습니다.')
  return value
}

export function useEventsDispatch() {
  const value = useContext(DispatchContext)
  if (!value) throw new Error('useEventsDispatch는 EventsProvider 안에서만 쓸 수 있습니다.')
  return value
}
