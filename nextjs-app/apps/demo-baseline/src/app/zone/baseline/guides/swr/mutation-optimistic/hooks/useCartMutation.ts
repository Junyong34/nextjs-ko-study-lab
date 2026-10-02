'use client'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { CART_KEY, patchCart, qtyOf, readServerLog } from '../lib/client-api'
import type { Cart, LabSettings, LatestAction, MountRun, MutationRun, ServerLogEntry } from '../types'
import type { EventLog } from './useEventLog'

/** 구독 추가 후 이 시간이 지나면 요청 여부를 판정한다 */
const MOUNT_SETTLE_MS = 700
/** SWR 기본 dedupingInterval과 같은 값을 SWRConfig에 명시한다 */
export const DEDUPING_INTERVAL = 2000

function withQty(cart: Cart | undefined, itemId: string, qty: number, runId: number): Cart {
  if (!cart) throw new Error('캐시에 장바구니가 없습니다')
  return { ...cart, optimisticRunId: runId, items: cart.items.map((i) => (i.id === itemId ? { ...i, qty } : i)) }
}

export function useCartMutation(log: EventLog) {
  const { mutate } = useSWRConfig()
  const [settings, setSettings] = useState<LabSettings>({ delayMs: 1500, failNext: false, revalidate: true })
  const [latest, setLatest] = useState<LatestAction | null>(null)
  const [pending, setPending] = useState(false)
  const [extraConsumers, setExtraConsumers] = useState(0)
  const [serverLog, setServerLog] = useState<ServerLogEntry[]>([])
  const [runSeq, setRunSeq] = useState(0)

  const refreshServerLog = async () => {
    const server = await readServerLog()
    setServerLog(server.entries)
    return server
  }

  const change = async (cart: Cart, itemId: string, delta: 1 | -1) => {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item || pending) return
    const id = runSeq + 1
    setRunSeq(id)
    const s = settings
    // 낙관적 값은 "요청이 그대로 성공한다"는 가정이다. 재고 상한은 서버만 적용한다.
    const optimisticQty = Math.max(1, item.qty + delta)
    const run: MutationRun = {
      id, itemId, itemName: item.name, delta, beforeQty: item.qty, optimisticQty,
      settings: s, startT: log.now(), serverQtyAfter: null, settled: false,
    }
    setLatest({ type: 'mutate', run })
    setPending(true)
    try {
      await mutate(CART_KEY, patchCart({ itemId, delta, delayMs: s.delayMs, fail: s.failNext }, log.record), {
        optimisticData: (current?: Cart) => withQty(current, itemId, optimisticQty, id),
        rollbackOnError: true,
        populateCache: true,
        revalidate: s.revalidate,
      })
    } catch {
      // throwOnError 기본값(true) 때문에 실패한 PATCH는 여기로 온다. 롤백은 SWR이 이미 끝냈다.
    }
    const server = await refreshServerLog()
    setLatest({ type: 'mutate', run: { ...run, serverQtyAfter: qtyOf(server.cart, itemId) ?? null, settled: true } })
    setPending(false)
  }

  const addConsumer = () => {
    const lastFetch = [...log.events].reverse().find((e) => e.kind === 'fetch-start')
    const startT = log.now()
    const run: MountRun = { startT, msSinceLastFetch: lastFetch ? startT - lastFetch.t : null, settled: false }
    log.record({ kind: 'mount', detail: `같은 키 구독 컴포넌트 추가 (직전 GET 시작 후 ${run.msSinceLastFetch ?? '-'}ms)` })
    setLatest({ type: 'mount', run })
    setExtraConsumers((n) => n + 1)
    setTimeout(() => {
      setLatest((cur) => (cur?.type === 'mount' && cur.run.startT === startT ? { type: 'mount', run: { ...run, settled: true } } : cur))
      void refreshServerLog()
    }, MOUNT_SETTLE_MS)
  }

  const reset = () => {
    setLatest(null)
    setPending(false)
    setExtraConsumers(0)
    setServerLog([])
  }

  return { settings, setSettings, latest, pending, extraConsumers, serverLog, change, addConsumer, refreshServerLog, reset }
}
