'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { runRevalidatePath } from '../actions'
import { LITERAL_TARGET_ID, PRODUCT_IDS, SNAPSHOT_MESSAGE } from '../paths'
import type { ProductSnapshot, RevalidateMode, RoundResult, SnapshotMessage } from '../types'

// 문서 기준 기대값: 어떤 id의 'use cache' 엔트리가 재생성되어야 하는가
export const EXPECTED_CHANGED: Record<RevalidateMode, string[]> = {
  reload: [],
  literal: [LITERAL_TARGET_ID],
  'pattern-page': [...PRODUCT_IDS],
  'pattern-no-type': [],
}

type Snapshots = Record<string, ProductSnapshot>
interface PendingRound {
  mode: RevalidateMode
  call: string
  before: Snapshots
  received: Snapshots
}

export function useProductFrames() {
  const [snapshots, setSnapshots] = useState<Snapshots>({})
  const [frameKey, setFrameKey] = useState(0)
  const [round, setRound] = useState<RoundResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isWaiting, setIsWaiting] = useState(false)
  const snapshotsRef = useRef<Snapshots>({})
  const pendingRef = useRef<PendingRound | null>(null)

  useEffect(() => {
    const onMessage = (event: MessageEvent<SnapshotMessage>) => {
      if (event.origin !== window.location.origin || event.data?.type !== SNAPSHOT_MESSAGE) return
      const { type: _type, ...snap } = event.data
      snapshotsRef.current = { ...snapshotsRef.current, [snap.id]: snap }
      setSnapshots(snapshotsRef.current)

      const pending = pendingRef.current
      if (!pending) return
      pending.received[snap.id] = snap
      if (PRODUCT_IDS.every((id) => pending.received[id])) {
        const actualChanged = PRODUCT_IDS.filter(
          (id) => pending.before[id]?.cacheId !== pending.received[id].cacheId,
        )
        setRound({
          mode: pending.mode,
          call: pending.call,
          before: pending.before,
          after: { ...pending.received },
          expectedChanged: EXPECTED_CHANGED[pending.mode],
          actualChanged,
        })
        pendingRef.current = null
        setIsWaiting(false)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const run = useCallback((mode: RevalidateMode) => {
    const before = { ...snapshotsRef.current }
    if (!PRODUCT_IDS.every((id) => before[id])) return // 초기 값이 모두 도착한 뒤에만 비교 가능
    startTransition(async () => {
      const call = mode === 'reload'
        ? '(revalidatePath 호출 없음 — iframe만 다시 요청)'
        : (await runRevalidatePath(mode)).call
      pendingRef.current = { mode, call, before, received: {} }
      setIsWaiting(true)
      setFrameKey((k) => k + 1) // iframe을 새로 마운트 → 각 상품 경로에 새 문서 요청
    })
  }, [])

  const reset = useCallback(() => {
    pendingRef.current = null
    setRound(null)
    setIsWaiting(false)
    setFrameKey((k) => k + 1)
  }, [])

  const ready = PRODUCT_IDS.every((id) => snapshots[id])
  return { snapshots, frameKey, round, busy: isPending || isWaiting, ready, run, reset }
}
