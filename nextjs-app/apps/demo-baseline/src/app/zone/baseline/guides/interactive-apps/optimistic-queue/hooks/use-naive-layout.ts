'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { saveLayoutSnapshot } from '../actions'
import { channelLayoutReducer } from '../reducers/channel-layout-reducer'
import type { IssuedMove, LayoutChange, LayoutGroup, LayoutModel } from '../types'

/**
 * naive: 확정 상태(confirmed)에서 다음 레이아웃을 계산해 전체를 저장한다.
 * 저장이 끝나기 전에 다음 변경이 들어오면 confirmed는 아직 옛 값이라
 * 두 번째 스냅샷에서 첫 변경이 빠진다.
 */
export function useNaiveLayout(initial: LayoutGroup[]): LayoutModel {
  const [confirmed, setConfirmed] = useState(initial)
  const [shown, setShown] = useOptimistic(confirmed)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [issued, setIssued] = useState<IssuedMove[]>([])

  function move(change: LayoutChange, injectFail: boolean) {
    setIssued((list) => [...list, { change, failed: injectFail }])
    const next = channelLayoutReducer(confirmed, change)
    startTransition(async () => {
      setShown(next)
      try {
        setConfirmed(await saveLayoutSnapshot(next, injectFail))
        setError(null)
      } catch {
        setError('저장에 실패해 마지막 확정 레이아웃으로 되돌렸습니다.')
      }
    })
  }

  return { shown, confirmed, isPending, error, issued, move }
}
