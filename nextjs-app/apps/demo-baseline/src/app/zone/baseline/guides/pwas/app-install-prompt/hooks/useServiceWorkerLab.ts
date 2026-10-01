'use client'
import { useCallback, useEffect, useState } from 'react'
import { SEGMENT_PATH, SW_URL } from '../constants'
import type { ActionResult, SwSnapshot } from '../types'

// 허용 scope(SEGMENT_PATH)보다 위쪽인 부모 경로. 등록을 시도하면 거부되어야 한다.
export const WIDE_SCOPE = '/zone/baseline/guides/pwas/'

const errorText = (error: unknown) =>
  error instanceof Error ? `${error.name}: ${error.message}` : String(error)

export function useServiceWorkerLab() {
  const [snapshot, setSnapshot] = useState<SwSnapshot>({ scope: null, state: null, controlled: false })
  const [register, setRegister] = useState<ActionResult | null>(null)
  const [wide, setWide] = useState<ActionResult | null>(null)
  const [pong, setPong] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return
    // getRegistration(url)은 그 URL을 제어하는 scope의 등록을 돌려준다.
    const reg = await navigator.serviceWorker.getRegistration(SEGMENT_PATH)
    setSnapshot({
      scope: reg ? new URL(reg.scope).pathname : null,
      state: reg?.active?.state ?? null,
      controlled: Boolean(navigator.serviceWorker.controller),
    })
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    refresh()
    navigator.serviceWorker.addEventListener('controllerchange', refresh)
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'pong') setPong(`pong ← scope ${new URL(event.data.scope).pathname}`)
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', refresh)
      navigator.serviceWorker.removeEventListener('message', onMessage)
    }
  }, [refresh])

  const registerWorker = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.register(SW_URL, { scope: SEGMENT_PATH })
      await navigator.serviceWorker.ready
      setRegister({ ok: true, detail: `등록 성공 · scope ${new URL(reg.scope).pathname}` })
    } catch (error) {
      setRegister({ ok: false, detail: errorText(error) })
    }
    await refresh()
  }, [refresh])

  const tryWideScope = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.register(SW_URL, { scope: WIDE_SCOPE })
      // 거부되지 않았다면 기대와 다른 결과다. 부모 경로 등록이 남지 않게 바로 해제한다.
      await reg.unregister()
      setWide({ ok: false, detail: `거부되지 않고 등록됨(해제함) · scope ${new URL(reg.scope).pathname}` })
    } catch (error) {
      setWide({ ok: true, detail: `거부됨 · ${errorText(error)}` })
    }
  }, [])

  const ping = useCallback(() => {
    const worker = navigator.serviceWorker.controller
    if (!worker) return setPong('이 페이지를 제어하는 서비스 워커가 없습니다')
    setPong('ping 전송 후 응답 대기…')
    worker.postMessage('ping')
  }, [])

  const unregister = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.getRegistration(SEGMENT_PATH)
    await reg?.unregister()
    setRegister(null)
    setWide(null)
    setPong(null)
    await refresh()
  }, [refresh])

  return { snapshot, register, wide, pong, registerWorker, tryWideScope, ping, unregister }
}
