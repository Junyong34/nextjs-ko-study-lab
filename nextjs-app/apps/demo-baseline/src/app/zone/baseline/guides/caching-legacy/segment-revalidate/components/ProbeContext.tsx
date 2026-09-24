'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AUTO_INTERVAL_MS, AUTO_REQUESTS } from '../routes'
import { fetchOnce } from '../probe'
import type { ProbeSample, RouteKey } from '../types'

interface ProbeContextValue {
  samples: ProbeSample[]
  running: 'auto' | 'single' | null
  /** 자동 관측을 끝까지 한 번 이상 마쳤는지 (판정 시점) */
  finished: boolean
  error: string | null
  requestOnce: (route: RouteKey) => Promise<void>
  runAuto: () => Promise<void>
  clear: () => void
}

const ProbeContext = createContext<ProbeContextValue | null>(null)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * layout에 한 번 배치되어, 하위 page 사이를 이동해도 실측 기록이 유지되게 한다.
 * 여기의 setTimeout은 "다음 실제 요청을 언제 보낼지"만 정한다. 결과값은 모두 서버 응답에서 읽는다.
 */
export function ProbeProvider({ children }: { children: React.ReactNode }) {
  const [samples, setSamples] = useState<ProbeSample[]>([])
  const [running, setRunning] = useState<ProbeContextValue['running']>(null)
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const startedAt = useRef<number | null>(null)
  const seq = useRef(0)
  const generation = useRef(0)

  const probe = useCallback(async (route: RouteKey, gen: number) => {
    if (startedAt.current === null) startedAt.current = Date.now()
    const sample = await fetchOnce(route, ++seq.current, startedAt.current)
    if (gen === generation.current) setSamples((prev) => [...prev, sample])
  }, [])

  const guarded = useCallback(async (kind: 'auto' | 'single', job: (gen: number) => Promise<void>) => {
    const gen = generation.current
    setRunning(kind)
    setError(null)
    try {
      await job(gen)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      if (gen === generation.current) setRunning(null)
    }
  }, [])

  const requestOnce = useCallback((route: RouteKey) => guarded('single', (gen) => probe(route, gen)), [guarded, probe])

  const runAuto = useCallback(
    () =>
      guarded('auto', async (gen) => {
        await probe('static', gen)
        for (let i = 0; i < AUTO_REQUESTS && gen === generation.current; i++) {
          await probe('isr-10s', gen)
          if (i < AUTO_REQUESTS - 1) await wait(AUTO_INTERVAL_MS)
        }
        await probe('static', gen)
        if (gen === generation.current) setFinished(true)
      }),
    [guarded, probe],
  )

  const clear = useCallback(() => {
    generation.current += 1 // 진행 중인 자동 관측을 끊는다
    startedAt.current = null
    seq.current = 0
    setSamples([])
    setFinished(false)
    setRunning(null)
    setError(null)
  }, [])

  const value = useMemo(
    () => ({ samples, running, finished, error, requestOnce, runAuto, clear }),
    [samples, running, finished, error, requestOnce, runAuto, clear],
  )
  return <ProbeContext.Provider value={value}>{children}</ProbeContext.Provider>
}

export function useProbe(): ProbeContextValue {
  const ctx = useContext(ProbeContext)
  if (!ctx) throw new Error('useProbe()는 <ProbeProvider> 안에서만 호출할 수 있습니다.')
  return ctx
}
