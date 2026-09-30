'use client'
import { useCallback, useEffect, useState } from 'react'
import {
  BEACON_ENDPOINT,
  MISSING_ENDPOINT,
  type BeaconAttempt,
  type BeaconTarget,
  type CheckPhase,
  type ReceivedBeacon,
} from '../types'

async function fetchReceived(): Promise<ReceivedBeacon[]> {
  const res = await fetch(BEACON_ENDPOINT, { cache: 'no-store' })
  return res.json()
}

export function useBeaconLab() {
  const [attempt, setAttempt] = useState<BeaconAttempt | null>(null)
  const [received, setReceived] = useState<ReceivedBeacon[]>([])
  const [phase, setPhase] = useState<CheckPhase>('idle')

  const refresh = useCallback(async () => {
    setReceived(await fetchReceived())
  }, [])

  // 진입 시 서버에 이미 쌓인 이벤트를 보여 준다(이전 시도 흔적은 초기화 버튼으로 비운다).
  useEffect(() => {
    fetchReceived().then(setReceived)
  }, [])

  const send = useCallback(async (target: BeaconTarget) => {
    const id = crypto.randomUUID().slice(0, 8)
    const body = new Blob(
      [JSON.stringify({ id, event: 'product_click', productId: 'sku-1024' })],
      { type: 'application/json' },
    )
    const queued = navigator.sendBeacon(target === 'ok' ? BEACON_ENDPOINT : MISSING_ENDPOINT, body)
    setAttempt({ id, target, queued })
    setPhase('checking')
    // 비콘은 비동기로 나가므로 잠시 뒤 서버 저장소를 조회한다.
    await new Promise((r) => setTimeout(r, 600))
    await refresh()
    setPhase('done')
  }, [refresh])

  const reset = useCallback(async () => {
    await fetch(BEACON_ENDPOINT, { method: 'DELETE' })
    setAttempt(null)
    setPhase('idle')
    await refresh()
  }, [refresh])

  const serverGotIt = attempt ? received.some((r) => r.id === attempt.id) : undefined
  return { attempt, received, phase, send, reset, refresh, serverGotIt }
}
