'use client'

import { useCallback, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { runOrderSettlementBatch } from '../actions'
import type { SettlementBatchResult, SettlementLogEntry, SettlementRunOutcome, SettlementSource } from '../types'
import { MAX_ORDER_COUNT, MIN_ORDER_COUNT } from '../types'

const DEFAULT_ORDER_COUNT = 4
const TICK_INTERVAL_MS = 100

/**
 * 주문 정산 배치를 실제로 두 가지 경로(Server Action / Route Handler)로 호출하고,
 * 클라이언트에서 관찰 가능한 실측값(왕복 시간, 진행 중 경과 시간)을 관리하는 훅.
 * 서버가 보낸 값(elapsedMs, declaredMaxDurationSeconds)은 그대로 통과시킬 뿐 다시 계산하지 않는다.
 */
export function useOrderSettlement() {
  const pathname = usePathname()
  const [orderCount, setOrderCount] = useState(DEFAULT_ORDER_COUNT)
  const [pendingSource, setPendingSource] = useState<SettlementSource | null>(null)
  const [pendingElapsedMs, setPendingElapsedMs] = useState(0)
  const [lastOutcome, setLastOutcome] = useState<SettlementRunOutcome | null>(null)
  const [logs, setLogs] = useState<SettlementLogEntry[]>([])
  const logIdRef = useRef(0)
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pushLog = useCallback((text: string, tone: SettlementLogEntry['tone'] = 'info') => {
    logIdRef.current += 1
    setLogs((prev) => [{ id: logIdRef.current, text, tone }, ...prev].slice(0, 6))
  }, [])

  const changeOrderCount = useCallback((delta: number) => {
    if (pendingSource) return
    setOrderCount((count) => Math.min(MAX_ORDER_COUNT, Math.max(MIN_ORDER_COUNT, count + delta)))
  }, [pendingSource])

  const stopTicker = useCallback(() => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current)
      tickerRef.current = null
    }
  }, [])

  const summarize = useCallback((result: SettlementBatchResult, httpStatus: number) => {
    const limitMs = result.declaredMaxDurationSeconds * 1000
    const verdict = result.exceededDeclaredLimit
      ? `선언된 ${result.declaredMaxDurationSeconds}초(${limitMs}ms)를 넘었지만 로컬은 강제 종료 없이 완료`
      : `선언된 ${result.declaredMaxDurationSeconds}초(${limitMs}ms) 이내로 완료`
    return `${result.source === 'server-action' ? 'Server Action' : 'Route Handler'} 완료: HTTP ${httpStatus} · 서버 처리 ${result.elapsedMs}ms · ${verdict}`
  }, [])

  const run = useCallback(
    async (source: SettlementSource) => {
      if (pendingSource) return
      setPendingSource(source)
      setPendingElapsedMs(0)
      const clientStart = Date.now()
      tickerRef.current = setInterval(() => setPendingElapsedMs(Date.now() - clientStart), TICK_INTERVAL_MS)

      pushLog(
        source === 'server-action'
          ? `Server Action 호출: 주문 ${orderCount}건 정산 시작`
          : `Route Handler 호출: 주문 ${orderCount}건 정산 시작 (POST ${pathname}/settle-batch)`,
        'info',
      )

      try {
        let result: SettlementBatchResult
        let httpStatus = 200
        if (source === 'server-action') {
          result = await runOrderSettlementBatch(orderCount)
        } else {
          const res = await fetch(`${pathname}/settle-batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderCount }),
            cache: 'no-store',
          })
          httpStatus = res.status
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          result = (await res.json()) as SettlementBatchResult
        }
        const clientRoundTripMs = Date.now() - clientStart
        setLastOutcome({ source, result, clientRoundTripMs, httpStatus })
        pushLog(summarize(result, httpStatus), result.exceededDeclaredLimit ? 'warn' : 'success')
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        setLastOutcome({ source, error: message })
        pushLog(`${source === 'server-action' ? 'Server Action' : 'Route Handler'} 실패: ${message}`, 'warn')
      } finally {
        stopTicker()
        setPendingSource(null)
      }
    },
    [orderCount, pathname, pendingSource, pushLog, stopTicker, summarize],
  )

  const reset = useCallback(() => {
    stopTicker()
    setOrderCount(DEFAULT_ORDER_COUNT)
    setPendingSource(null)
    setPendingElapsedMs(0)
    setLastOutcome(null)
    setLogs([])
    logIdRef.current = 0
  }, [stopTicker])

  return {
    orderCount,
    changeOrderCount,
    pendingSource,
    pendingElapsedMs,
    lastOutcome,
    logs,
    runViaServerAction: () => run('server-action'),
    runViaRouteHandler: () => run('route-handler'),
    reset,
  }
}
