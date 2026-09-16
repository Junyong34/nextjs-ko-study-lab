'use client'
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { MOCK_PRODUCTS, DemoResetButton } from '@study/demo-kit'
import { runAnalyticsBatch } from '../actions'
import { ANALYTICS_EVENT_COUNT, type BatchMode, type BatchStatusResponse } from '../types'
import { VerificationFooter } from './VerificationFooter'

const API_ENDPOINT = '/zone/baseline/functions/after/analytics-batch/api'
const POLL_INTERVAL_MS = 150

const SELECTABLE_PRODUCTS = MOCK_PRODUCTS.slice(0, 2)

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  running: '실행 중',
  done: '완료',
}

function formatClock(ms: number): string {
  const d = new Date(ms)
  return `${d.toLocaleTimeString('ko-KR', { hour12: false })}.${String(ms % 1000).padStart(3, '0')}`
}

export function AfterAnalyticsBatchDemo() {
  const [selectedProductId, setSelectedProductId] = useState(SELECTABLE_PRODUCTS[0].id)
  const [quantity, setQuantity] = useState(1)
  const [mode, setMode] = useState<BatchMode>('sequential')
  const [isPending, startTransition] = useTransition()
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState<BatchStatusResponse | null>(null)
  const [clientRoundTripMs, setClientRoundTripMs] = useState<number | null>(null)
  const [history, setHistory] = useState<BatchStatusResponse[]>([])
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
  }, [])

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  const startPolling = (batchId: string) => {
    stopPolling()
    pollingRef.current = setInterval(async () => {
      const res = await fetch(`${API_ENDPOINT}?batchId=${batchId}`, { cache: 'no-store' })
      if (!res.ok) return
      const data: BatchStatusResponse = await res.json()
      setCurrentStatus(data)
      if (data.isComplete) {
        stopPolling()
        setHistory((prev) => [data, ...prev].slice(0, 4))
      }
    }, POLL_INTERVAL_MS)
  }

  const handleTrigger = () => {
    startTransition(async () => {
      setCurrentStatus(null)
      const clientStart = performance.now()
      const result = await runAnalyticsBatch(mode)
      setClientRoundTripMs(Math.round(performance.now() - clientStart))
      setCurrentBatchId(result.batchId)
      startPolling(result.batchId)
    })
  }

  const selectedProduct = SELECTABLE_PRODUCTS.find((p) => p.id === selectedProductId) ?? SELECTABLE_PRODUCTS[0]
  const isBatchRunning = currentBatchId !== null && currentStatus?.isComplete !== true
  const canTrigger = !isPending && !isBatchRunning

  const handleReset = () => {
    stopPolling()
    setCurrentBatchId(null)
    setCurrentStatus(null)
    setClientRoundTripMs(null)
    setHistory([])
    setMode('sequential')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-3 border-b pb-3 dark:border-zinc-800">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">after() 비동기 분석 배치 트리거 콘솔</h4>
            <p className="text-xs text-zinc-500">
              `actions.ts`의 `runAnalyticsBatch()` Server Action이 `after()` 콜백 안에서 이벤트 {ANALYTICS_EVENT_COUNT}건을 처리합니다.
            </p>
          </div>
          <DemoResetButton onReset={handleReset} label="예제 초기화" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 상품/수량 선택 */}
          <div className="space-y-2.5 rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">주문 이벤트 발생 상품</span>
            <div className="flex flex-wrap gap-2">
              {SELECTABLE_PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProductId(product.id)}
                  className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                    selectedProductId === product.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-bold font-mono">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
              >
                +
              </button>
              <span className="ml-auto text-[11px] text-zinc-500">
                {selectedProduct.price.toLocaleString()}원 x {quantity}
              </span>
            </div>
          </div>

          {/* 처리 모드 선택 */}
          <div className="space-y-2.5 rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">배치 처리 모드</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode('sequential')}
                className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  mode === 'sequential' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                순차 처리 (for await)
              </button>
              <button
                type="button"
                onClick={() => setMode('parallel')}
                className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  mode === 'parallel' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                병렬 처리 (Promise.all)
              </button>
            </div>
            <button
              type="button"
              onClick={handleTrigger}
              disabled={!canTrigger}
              className="w-full rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              {isPending ? '요청 전송 중...' : isBatchRunning ? '백그라운드 배치 처리 중...' : '배치 트리거'}
            </button>
            {clientRoundTripMs !== null && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                클라이언트 응답 왕복 시간(RTT): {clientRoundTripMs}ms (배치 완료를 기다리지 않고 즉시 반환됨)
              </p>
            )}
          </div>
        </div>

        {/* 실시간 배치 진행 상황 */}
        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
            after() 백그라운드 배치 진행 상황 ({currentStatus?.mode === 'parallel' ? '병렬' : '순차'} · {POLL_INTERVAL_MS}ms 간격 폴링)
          </div>
          {!currentStatus ? (
            <div className="text-zinc-500 py-2">배치를 트리거하면 이벤트별 시작/완료 시각이 여기에 실시간으로 표시됩니다.</div>
          ) : (
            currentStatus.events.map((event, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 text-[11px]">
                <span
                  className={`rounded px-1.5 py-0.5 font-bold ${
                    event.status === 'done'
                      ? 'bg-emerald-900 text-emerald-300'
                      : event.status === 'running'
                      ? 'bg-amber-900 text-amber-300'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {STATUS_LABEL[event.status]}
                </span>
                <span className="text-zinc-300">{event.name}</span>
                <span className="ml-auto text-zinc-500">
                  {event.startedAt ? formatClock(event.startedAt) : '--:--:--.---'} →{' '}
                  {event.completedAt ? formatClock(event.completedAt) : '--:--:--.---'}
                  {event.durationMs !== null && ` (${event.durationMs}ms)`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <VerificationFooter mode={mode} current={currentStatus} history={history} clientRoundTripMs={clientRoundTripMs} />
    </div>
  )
}
