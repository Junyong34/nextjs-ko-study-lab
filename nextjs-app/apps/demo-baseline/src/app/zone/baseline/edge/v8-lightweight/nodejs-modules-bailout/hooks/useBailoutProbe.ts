'use client'

import { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { FsProbe, ProbeResult, ProbeSegment, ProbeTarget } from '../types'

type ProbeMap = Record<ProbeSegment, ProbeResult>

const IDLE: ProbeMap = { node: { status: 'idle' }, edge: { status: 'idle' } }

async function fetchProbe(url: string): Promise<ProbeResult> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` }
    return { status: 'ok', httpStatus: res.status, data: (await res.json()) as FsProbe }
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : String(error) }
  }
}

/** 현재 페이지 하위의 ./node, ./edge Route Handler를 실제로 fetch한다. 버튼을 누르기 전에는 호출하지 않는다. */
export function useBailoutProbe() {
  const pathname = usePathname()
  const [target, setTarget] = useState<ProbeTarget>('existing')
  const [results, setResults] = useState<ProbeMap>(IDLE)
  const [runs, setRuns] = useState(0)

  const run = useCallback(
    async (segment: ProbeSegment) => {
      setResults((prev) => ({ ...prev, [segment]: { status: 'loading' } }))
      const result = await fetchProbe(`${pathname}/${segment}?target=${target}`)
      setResults((prev) => ({ ...prev, [segment]: result }))
      setRuns((n) => n + 1)
    },
    [pathname, target],
  )

  const reset = useCallback(() => {
    setResults(IDLE)
    setTarget('existing')
    setRuns(0)
  }, [])

  return { pathname, target, setTarget, results, runs, run, reset }
}
