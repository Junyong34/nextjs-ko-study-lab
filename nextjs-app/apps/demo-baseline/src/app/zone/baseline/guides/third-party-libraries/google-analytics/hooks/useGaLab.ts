'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import { countExternalHosts, measurePush, readSnapshot } from '../lib/measure'
import {
  DEMO_EVENT_NAME,
  DEMO_EVENT_PARAMS,
  GA_HOSTS,
  GA_OPT_OUT_KEY,
  type GaSnapshot,
  type PushResult,
  type ScriptLoad,
} from '../types'

const LOAD_TIMEOUT_MS = 10_000

export function useGaLab() {
  const [mounted, setMounted] = useState(false)
  const [load, setLoad] = useState<ScriptLoad>('idle')
  const [loadMs, setLoadMs] = useState<number | null>(null)
  const [snapshot, setSnapshot] = useState<GaSnapshot | null>(null)
  const [push, setPush] = useState<PushResult | null>(null)
  // 페이지 진입(하이드레이션) 시점에 GA 호스트로 나간 요청 수: 자동 로드가 없다는 증거
  const [gaRequestsAtEntry, setGaRequestsAtEntry] = useState<number | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    const hosts = countExternalHosts()
    setGaRequestsAtEntry(GA_HOSTS.reduce((n, h) => n + (hosts[h] ?? 0), 0))
    setSnapshot(readSnapshot())
    return () => observerRef.current?.disconnect()
  }, [])

  // 마운트 뒤에는 gtag.js가 비동기로 dataLayer·요청을 바꾸므로 주기적으로 다시 읽는다.
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => setSnapshot(readSnapshot()), 500)
    return () => clearInterval(id)
  }, [mounted])

  const mount = useCallback(() => {
    // gtag.js가 데모 ID로 측정 요청을 보내지 않도록 공식 opt-out 플래그를 먼저 켠다(데모 ID 전용 키).
    ;(window as unknown as Record<string, unknown>)[GA_OPT_OUT_KEY] = true
    // next/script가 body에 <script id="_next-ga">를 붙이는 순간 load/error를 구독한다.
    // MutationObserver 콜백은 마이크로태스크라 네트워크 load 이벤트보다 먼저 실행된다.
    const startedAt = performance.now()
    const observer = new MutationObserver(() => {
      const el = document.getElementById('_next-ga')
      if (!el) return
      observer.disconnect()
      setLoad('loading')
      const timer = setTimeout(() => setLoad((s) => (s === 'loading' ? 'timeout' : s)), LOAD_TIMEOUT_MS)
      el.addEventListener('load', () => {
        clearTimeout(timer)
        setLoad('loaded')
        setLoadMs(Math.round(performance.now() - startedAt))
      }, { once: true })
      el.addEventListener('error', () => {
        clearTimeout(timer)
        setLoad('error')
      }, { once: true })
    })
    observer.observe(document.body, { childList: true })
    observerRef.current = observer
    setMounted(true)
  }, [])

  const sendEvent = useCallback(() => {
    // GoogleAnalytics가 렌더되기 전이면 sendGAEvent는 콘솔 경고만 남기고 아무것도 push하지 않는다.
    const result = measurePush(mounted ? 'after-mount' : 'before-mount', () =>
      sendGAEvent('event', DEMO_EVENT_NAME, DEMO_EVENT_PARAMS),
    )
    setPush(result)
    setSnapshot(readSnapshot())
  }, [mounted])

  return { mounted, load, loadMs, snapshot, push, gaRequestsAtEntry, mount, sendEvent }
}

export type GaLabState = ReturnType<typeof useGaLab>
