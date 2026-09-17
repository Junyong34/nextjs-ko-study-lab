'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { fetchStockWithRevalidate } from '../actions'
import type { CacheStatus, PollLogEntry, ProductCode } from '../types'
import { VerificationFooter } from './VerificationFooter'

const PRODUCTS: { code: ProductCode; label: string }[] = [
  { code: 'PROD-001', label: '러닝화 (#001)' },
  { code: 'PROD-002', label: '윈드브레이커 (#002)' },
]

const REVALIDATE_OPTIONS = [5, 10] as const

const POLL_INTERVAL_MS = 1000
const LOG_LIMIT = 10

export function FetchExtendedRevalidateDemo() {
  const [productCode, setProductCode] = useState<ProductCode>('PROD-001')
  const [revalidateSeconds, setRevalidateSeconds] = useState<number>(5)
  const [sessionId, setSessionId] = useState(1)
  const [isPolling, setIsPolling] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [log, setLog] = useState<PollLogEntry[]>([])

  const lastOriginCallCountRef = useRef<number | null>(null)
  const clientSeqRef = useRef(0)

  const poll = useCallback(async () => {
    setIsFetching(true)
    try {
      const result = await fetchStockWithRevalidate(productCode, sessionId, revalidateSeconds)
      const prevCount = lastOriginCallCountRef.current
      const cacheStatus: CacheStatus =
        prevCount === null ? 'INIT' : prevCount === result.originCallCount ? 'HIT' : 'MISS'
      lastOriginCallCountRef.current = result.originCallCount
      clientSeqRef.current += 1

      setLog((prev) => [{ ...result, clientSeq: clientSeqRef.current, cacheStatus }, ...prev].slice(0, LOG_LIMIT))
    } finally {
      setIsFetching(false)
    }
  }, [productCode, sessionId, revalidateSeconds])

  useEffect(() => {
    if (!isPolling) return
    const id = setInterval(poll, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [isPolling, poll])

  const startNewSession = useCallback(() => {
    setIsPolling(false)
    setLog([])
    lastOriginCallCountRef.current = null
    clientSeqRef.current = 0
    setSessionId((id) => id + 1)
  }, [])

  const handleSelectProduct = (code: ProductCode) => {
    if (code === productCode) return
    setProductCode(code)
    startNewSession()
  }

  const handleSelectRevalidate = (seconds: number) => {
    if (seconds === revalidateSeconds) return
    setRevalidateSeconds(seconds)
    startNewSession()
  }

  return (
    <>
      <DemoPlaygroundCard title="Next.js 확장 fetch revalidate 옵션 실습">
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">재고 조회 fetch 실습 콘솔</h4>
              <p className="text-xs text-zinc-500">
                아래 fetch가 1초 간격으로 <code>/api</code> 내부 Route Handler를{' '}
                <code>next: {'{'} revalidate: {revalidateSeconds} {'}'}</code>로 호출합니다.
              </p>
            </div>
            <DemoResetButton onReset={startNewSession} label="세션 초기화" loadingLabel="초기화 중..." />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">상품 선택</span>
              <div className="flex gap-2">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.code}
                    onClick={() => handleSelectProduct(p.code)}
                    className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                      productCode === p.code
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <span className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 pt-1">
                revalidate 옵션 (초)
              </span>
              <div className="flex gap-2">
                {REVALIDATE_OPTIONS.map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => handleSelectRevalidate(seconds)}
                    className={`rounded px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer ${
                      revalidateSeconds === seconds
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    revalidate: {seconds}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsPolling((p) => !p)}
                  className={`rounded px-3 py-1 text-xs font-bold cursor-pointer ${
                    isPolling ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  }`}
                >
                  {isPolling ? '● 자동 폴링 중 (1초 간격)' : '자동 폴링 시작'}
                </button>
                <button
                  onClick={poll}
                  disabled={isFetching}
                  className="rounded bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-800 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  지금 1회 조회
                </button>
              </div>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
              <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
                실측 로그 (세션 #{sessionId}, 최근 {LOG_LIMIT}건):
              </div>
              <div className="space-y-1 pt-1 text-[11px] max-h-48 overflow-y-auto">
                {log.length === 0 && <div className="text-zinc-600">아직 조회 기록이 없습니다.</div>}
                {log.map((entry) => (
                  <div key={entry.clientSeq} className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500">
                      #{entry.clientSeq} {entry.fetchedAt}
                    </span>
                    <span
                      className={
                        entry.cacheStatus === 'HIT'
                          ? 'text-emerald-400 font-bold'
                          : entry.cacheStatus === 'MISS'
                            ? 'text-amber-400 font-bold'
                            : 'text-zinc-400 font-bold'
                      }
                    >
                      {entry.cacheStatus}
                    </span>
                    <span className="text-zinc-300">
                      재고 {entry.stock}개 (origin #{entry.originCallCount})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter productCode={productCode} revalidateSeconds={revalidateSeconds} log={log} isPolling={isPolling} />
    </>
  )
}
