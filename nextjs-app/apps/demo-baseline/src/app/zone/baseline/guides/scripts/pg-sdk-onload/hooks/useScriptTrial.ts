'use client'

import { useCallback, useRef, useState } from 'react'
import { requestStartOf, resetScriptGlobals } from '../lib/timing'
import type { ActiveTrial, EventKind, PayAttempt, PluginRecord, TrialOrder, TrialResult } from '../types'

type Trials = Partial<Record<TrialOrder, TrialResult>>

/**
 * 시도(trial) 하나 = 새 runId로 <Script>를 새로 마운트해 실제 네트워크 로드를 다시 일으키는 것.
 * 모든 이벤트는 호출 시점의 performance.now()와 typeof window.PgSdk를 그대로 기록한다.
 */
export function useScriptTrial() {
  const [active, setActive] = useState<ActiveTrial | null>(null)
  const [trials, setTrials] = useState<Trials>({})
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [payAttempts, setPayAttempts] = useState<PayAttempt[]>([])
  const activeRef = useRef<ActiveTrial | null>(null)
  const runCounter = useRef(0)

  const record = useCallback(
    (runId: number, kind: EventKind, detail: string, patch: Partial<TrialResult> = {}) => {
      const current = activeRef.current
      if (!current || current.runId !== runId) return // 이전 시도의 늦은 콜백은 무시
      const at = Math.round(performance.now() - current.startedAt)
      setTrials((prev) => {
        const base = prev[current.order]
        if (!base) return prev
        const event = { seq: base.events.length + 1, kind, at, sdkPresent: typeof window.PgSdk !== 'undefined', detail }
        return { ...prev, [current.order]: { ...base, ...patch, events: [...base.events, event] } }
      })
    },
    [],
  )

  const start = useCallback((order: TrialOrder) => {
    resetScriptGlobals()
    runCounter.current += 1
    const next: ActiveTrial = { runId: runCounter.current, order, startedAt: performance.now() }
    activeRef.current = next
    setActive(next)
    setSdkLoaded(false)
    const first = { seq: 1, kind: 'start' as const, at: 0, sdkPresent: false, detail: `${order} 시도 시작: <Script> 마운트` }
    setTrials((prev) => ({
      ...prev,
      [order]: { order, runId: next.runId, events: [first], plugin: null, sdkRequestStart: null, pluginRequestStart: null },
    }))
  }, [])

  const onSdkLoad = useCallback(
    (runId: number, src: string) => {
      const current = activeRef.current
      if (!current || current.runId !== runId) return
      setSdkLoaded(true)
      const reqStart = requestStartOf(src)
      record(current.runId, 'sdk-onLoad', 'SDK 응답 실행 완료', {
        sdkRequestStart: reqStart === null ? null : Math.round(reqStart - current.startedAt),
      })
    },
    [record],
  )

  const onPluginLoad = useCallback(
    (runId: number, src: string) => {
      const current = activeRef.current
      if (!current || current.runId !== runId) return
      const reqStart = requestStartOf(src)
      const plugin: PluginRecord | null = window.PgWidget ?? null
      record(current.runId, 'plugin-onLoad', plugin?.ok ? '플러그인이 PgSdk를 찾아 위젯 등록 성공' : `플러그인 실행 시 ${plugin?.error ?? 'PgSdk 없음'}`, {
        plugin,
        pluginRequestStart: reqStart === null ? null : Math.round(reqStart - current.startedAt),
      })
    },
    [record],
  )

  /** window.PgSdk.requestPay를 가드 없이 그대로 호출한다. SDK 준비 전이면 TypeError가 실제로 발생한다. */
  const pay = useCallback(() => {
    let ok = false
    let detail: string
    try {
      const result = window.PgSdk!.requestPay({ orderName: '겨울 러닝화', amount: 89000 })
      ok = true
      detail = `성공 paymentKey=${result.paymentKey}`
    } catch (error) {
      detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    }
    setPayAttempts((prev) => [...prev, { seq: prev.length + 1, afterOnLoad: sdkLoaded, ok, detail }])
  }, [sdkLoaded])

  const reset = useCallback(() => {
    resetScriptGlobals()
    activeRef.current = null
    setActive(null)
    setTrials({})
    setSdkLoaded(false)
    setPayAttempts([])
  }, [])

  return { active, trials, sdkLoaded, payAttempts, start, record, onSdkLoad, onPluginLoad, pay, reset }
}
