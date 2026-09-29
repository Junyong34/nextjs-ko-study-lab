'use client'

import { startTransition, useActionState, useOptimistic, useState } from 'react'
import { saveLayoutChange } from '../actions'
import { channelLayoutReducer } from '../reducers/channel-layout-reducer'
import type { IssuedMove, LayoutChange, LayoutGroup, LayoutModel } from '../types'

type Payload = { change: LayoutChange; injectFail: boolean }
type QueueState = { groups: LayoutGroup[]; error: string | null }

/**
 * queued: useActionState가 저장을 순서대로 처리하고,
 * 이전 저장의 반환값(prev.groups)이 다음 변경의 기준이 된다.
 */
export function useQueuedLayout(initial: LayoutGroup[]): LayoutModel {
  const [state, dispatch, isPending] = useActionState(
    async (prev: QueueState, { change, injectFail }: Payload): Promise<QueueState> => {
      try {
        const groups = await saveLayoutChange(prev.groups, change, injectFail)
        return { groups, error: null }
      } catch {
        // 역변경을 계산하지 않는다. 이전 확정 상태를 그대로 돌려주면 임시 값이 사라진 뒤 그 상태가 렌더된다.
        return { groups: prev.groups, error: '저장에 실패해 마지막 확정 레이아웃으로 되돌렸습니다.' }
      }
    },
    { groups: initial, error: null },
  )
  const [shown, addOptimistic] = useOptimistic(
    state.groups,
    (groups: LayoutGroup[], payload: Payload) => channelLayoutReducer(groups, payload.change),
  )
  const [issued, setIssued] = useState<IssuedMove[]>([])

  function move(change: LayoutChange, injectFail: boolean) {
    setIssued((list) => [...list, { change, failed: injectFail }])
    startTransition(() => {
      addOptimistic({ change, injectFail })
      dispatch({ change, injectFail })
    })
  }

  return { shown, confirmed: state.groups, isPending, error: state.error, issued, move }
}
