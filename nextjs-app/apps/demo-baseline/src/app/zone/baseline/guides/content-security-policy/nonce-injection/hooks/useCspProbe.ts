'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { InjectionResult, NonceSample, PageSnapshot } from '../types'
import { attemptInjection, sampleNonce } from '../lib/measure'

const STORAGE_KEY = 'baseline:csp-nonce:loads'

interface LoadRecord {
  current: string | null
  previous: string | null
}

const read = (): LoadRecord => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as LoadRecord
  } catch {
    // 저장소를 쓸 수 없으면 새로고침 비교만 대기 상태로 남는다.
  }
  return { current: null, previous: null }
}
const write = (v: LoadRecord) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(v))
  } catch {
    // 위와 동일
  }
}

/**
 * 이번 로드의 nonce를 기록하고 직전 로드의 nonce를 돌려준다.
 * StrictMode(dev)는 effect를 두 번 실행하므로, 같은 nonce가 이미 current면 previous를 건드리지 않는다.
 */
function recordLoad(nonce: string | null): string | null {
  const rec = read()
  if (rec.current === nonce) return rec.previous
  write({ current: nonce, previous: rec.current })
  return rec.current
}

export function useCspProbe(serverNonce: string | null) {
  const [page, setPage] = useState<PageSnapshot>({ serverNonce, previousNonce: null, demo: null })
  const [samples, setSamples] = useState<NonceSample[]>([])
  const [injection, setInjection] = useState<InjectionResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  const observe = useCallback(() => {
    setPage((p) => ({ ...p, demo: window.__cspDemo ? structuredClone(window.__cspDemo) : null }))
  }, [])

  useEffect(() => {
    // 직전 로드의 nonce를 읽고 이번 nonce로 교체한다. next/script(afterInteractive)는 하이드레이션 뒤에 실행되므로 몇 차례 다시 읽는다.
    const previousNonce = recordLoad(serverNonce)
    setPage({ serverNonce, previousNonce, demo: window.__cspDemo ? structuredClone(window.__cspDemo) : null })
    const timers = [200, 600, 1500].map((ms) => setTimeout(observe, ms))
    return () => timers.forEach(clearTimeout)
  }, [serverNonce, observe])

  const requestNonce = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const s = await sampleNonce()
      setSamples((prev) => [...prev, s].slice(-5))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }, [])

  const inject = useCallback(async () => {
    if (!hostRef.current) return
    setBusy(true)
    setInjection(await attemptInjection(hostRef.current))
    setBusy(false)
  }, [])

  const reset = useCallback(() => {
    setSamples([])
    setInjection(null)
    setError(null)
    setPage((p) => ({ ...p, previousNonce: null }))
    write({ current: serverNonce, previous: null })
  }, [serverNonce])

  return { page, samples, injection, busy, error, hostRef, requestNonce, inject, reset, observe }
}
