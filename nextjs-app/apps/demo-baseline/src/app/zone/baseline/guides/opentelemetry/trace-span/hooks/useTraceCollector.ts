'use client'

import { useCallback, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { EchoResult, Remote, SpansResponse } from '../types'

const IDLE = { status: 'idle' } as const
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const message = (e: unknown) => (e instanceof Error ? e.message : String(e))

/**
 * 링버퍼 조회(spans), 브라우저 직접 echo 호출, 새 요청(router.refresh), 초기화를 담당한다.
 * 버튼을 누르기 전에는 아무것도 호출하지 않는다. 새 요청이 오면 page가 key로 이 상태를 리마운트한다.
 */
export function useTraceCollector(traceId: string | null) {
  const pathname = usePathname()
  const router = useRouter()
  const [refreshing, startRefresh] = useTransition()
  const [spans, setSpans] = useState<Remote<SpansResponse>>(IDLE)
  const [direct, setDirect] = useState<Remote<EchoResult>>(IDLE)

  const collect = useCallback(async () => {
    if (!traceId) return
    setSpans({ status: 'loading' })
    try {
      // 요청 root span은 응답 스트림이 끝나야 종료(=버퍼 기록)되므로 잠깐 기다렸다 다시 읽는다.
      for (let attempt = 0; ; attempt++) {
        const res = await fetch(`${pathname}/spans?traceId=${traceId}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as SpansResponse
        const hasRoot = data.spans.some((s) => s.parentSpanId === null)
        if (hasRoot || attempt >= 4) return setSpans({ status: 'ok', data })
        await wait(300)
      }
    } catch (e) {
      setSpans({ status: 'error', message: message(e) })
    }
  }, [pathname, traceId])

  const callDirect = useCallback(async () => {
    setDirect({ status: 'loading' })
    try {
      const res = await fetch(`${pathname}/echo`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setDirect({ status: 'ok', data: (await res.json()) as EchoResult })
    } catch (e) {
      setDirect({ status: 'error', message: message(e) })
    }
  }, [pathname])

  const refresh = useCallback(() => startRefresh(() => router.refresh()), [router])

  const reset = useCallback(async () => {
    await fetch(`${pathname}/spans`, { method: 'DELETE' }).catch(() => undefined)
    setSpans(IDLE)
    setDirect(IDLE)
    refresh()
  }, [pathname, refresh])

  return { spans, direct, refreshing, collect, callDirect, clearDirect: () => setDirect(IDLE), refresh, reset }
}
