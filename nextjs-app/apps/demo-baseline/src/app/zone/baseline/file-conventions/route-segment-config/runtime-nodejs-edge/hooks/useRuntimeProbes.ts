'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PROBE_SEGMENTS, type ProbeResult, type ProbeSegment, type RuntimeProbe } from '../types'

type ProbeMap = Record<ProbeSegment, ProbeResult>

const LOADING: ProbeMap = {
  default: { status: 'loading' },
  node: { status: 'loading' },
  edge: { status: 'loading' },
}

async function fetchProbe(url: string): Promise<ProbeResult> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` }
    const data = (await res.json()) as RuntimeProbe
    return { status: 'ok', httpStatus: res.status, data }
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * 현재 페이지 경로 하위의 default/node/edge Route Handler를 실제로 fetch한다.
 * round가 바뀔 때마다 세 엔드포인트를 동시에 다시 호출한다.
 */
export function useRuntimeProbes() {
  const pathname = usePathname()
  const [round, setRound] = useState(1)
  const [results, setResults] = useState<ProbeMap>(LOADING)

  useEffect(() => {
    let cancelled = false
    setResults(LOADING)
    Promise.all(PROBE_SEGMENTS.map((segment) => fetchProbe(`${pathname}/${segment}`))).then(
      (list) => {
        if (cancelled) return
        setResults({ default: list[0], node: list[1], edge: list[2] })
      },
    )
    return () => {
      cancelled = true
    }
  }, [pathname, round])

  const remeasure = useCallback(() => setRound((r) => r + 1), [])

  return { pathname, round, results, remeasure }
}
