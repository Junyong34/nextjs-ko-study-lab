'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ERROR_MARKER, MASKED_MESSAGE, PROBE_GLOBAL, PROBE_PATH, SCRIPT_ID_PREFIX, TRIALS, alternateOrigin, probeUrl } from '../lib/trials'
import type { CrossOriginMode, ServerEcho, TrialOutcome, TrialResult, TrialSpec } from '../types'

const TIMEOUT_MS = 5000

/** 화면에 <Script>로 렌더할 시도 하나 */
export interface MountedScript {
  key: string
  src: string
  crossOrigin?: CrossOriginMode
}

interface Capture {
  message: string | null
  filename: string | null
}

type ProbeStore = Record<string, ServerEcho | undefined>

function probeStore(): ProbeStore {
  return ((window as unknown as Record<string, ProbeStore | undefined>)[PROBE_GLOBAL] ??= {})
}

/**
 * 다른 출처 주소의 probe 스크립트를 next/script <Script>로 하나씩 로드하고 결과를 실측한다.
 * - onLoad/onError: <Script>가 실제로 호출한 콜백
 * - crossorigin 속성/프로퍼티: 로드 후 DOM의 <script> 요소에서 읽은 값
 * - 오류 메시지: window의 error 이벤트(capture 단계)에서 받은 message/filename
 */
export function useCrossOriginTrials() {
  const [origin, setOrigin] = useState<string | null | undefined>(undefined)
  const [mounted, setMounted] = useState<MountedScript[]>([])
  const [results, setResults] = useState<Record<string, TrialResult>>({})
  const [running, setRunning] = useState<string | null>(null)
  const settleRef = useRef(new Map<string, (outcome: TrialOutcome) => void>())
  const captureRef = useRef<Capture | null>(null)
  const busyRef = useRef(false)

  useEffect(() => setOrigin(alternateOrigin(window.location)), [])

  useEffect(() => {
    // 실습 스크립트가 일부러 던진 오류만 가로챈다. 리소스 로드 실패(일반 Event)는 건드리지 않아야
    // <Script>의 onError가 정상 호출된다. preventDefault로 콘솔의 Uncaught 출력을, stopImmediatePropagation으로
    // 개발 오버레이 표시를 막는다(capture 단계 리스너가 같은 대상의 일반 리스너보다 먼저 실행된다).
    const onError = (event: Event) => {
      const capture = captureRef.current
      if (!capture || !(event instanceof ErrorEvent)) return
      const fromProbe = event.filename.includes(PROBE_PATH) || event.message.includes(ERROR_MARKER) || event.message === MASKED_MESSAGE
      if (!fromProbe) return
      capture.message = event.message
      capture.filename = event.filename || null
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    window.addEventListener('error', onError, true)
    return () => window.removeEventListener('error', onError, true)
  }, [])

  const settle = useCallback((key: string, outcome: TrialOutcome) => {
    settleRef.current.get(key)?.(outcome)
  }, [])

  const runOne = useCallback(async (spec: TrialSpec, from: string) => {
    const key = `${spec.id}-${Date.now().toString(36)}`
    const src = probeUrl(from, key, spec.cors)
    const capture: Capture = { message: null, filename: null }
    captureRef.current = capture
    setRunning(spec.id)
    const startedAt = performance.now()
    const outcome = await new Promise<TrialOutcome>((resolve) => {
      settleRef.current.set(key, resolve)
      setMounted((list) => [...list, { key, src, crossOrigin: spec.crossOrigin }])
      window.setTimeout(() => resolve('timeout'), TIMEOUT_MS)
    })
    settleRef.current.delete(key)
    captureRef.current = null
    const el = document.getElementById(`${SCRIPT_ID_PREFIX}${key}`) as HTMLScriptElement | null
    const result: TrialResult = {
      specId: spec.id,
      url: src,
      outcome,
      attr: el?.getAttribute('crossorigin') ?? null,
      prop: el ? el.crossOrigin : null,
      echo: probeStore()[key] ?? null,
      errorMessage: capture.message,
      errorFilename: capture.filename,
      durationMs: Math.round(performance.now() - startedAt),
      measuredAt: new Date().toISOString(),
    }
    setResults((prev) => ({ ...prev, [spec.id]: result }))
  }, [])

  const run = useCallback(async (specs: TrialSpec[]) => {
    if (!origin || busyRef.current) return
    busyRef.current = true
    try {
      // 오류 이벤트를 시도별로 구분하려고 한 번에 하나씩 순서대로 로드한다.
      for (const spec of specs) await runOne(spec, origin)
    } finally {
      busyRef.current = false
      setRunning(null)
    }
  }, [origin, runOne])

  const reset = useCallback(() => {
    if (busyRef.current) return
    document.querySelectorAll(`script[id^="${SCRIPT_ID_PREFIX}"]`).forEach((el) => el.remove())
    delete (window as unknown as Record<string, unknown>)[PROBE_GLOBAL]
    setMounted([])
    setResults({})
  }, [])

  return {
    origin,
    mounted,
    results,
    running,
    settle,
    runAll: () => run(TRIALS),
    runTrial: (spec: TrialSpec) => run([spec]),
    reset,
  }
}
