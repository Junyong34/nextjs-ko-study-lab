'use client'
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { DemoPlaygroundCard, DemoResetButton, MOCK_ORDERS } from '@study/demo-kit'
import { fetchAuditLogEntry, resetAuditLog, submitOrder } from '../actions'
import { formatTimestamp } from '../format'
import type { AuditLogEntry, DemoPhase, SubmitOrderResult } from '../types'
import { VerificationFooter } from './VerificationFooter'

const POLL_INTERVAL_MS = 150
const MAX_POLL_ATTEMPTS = 40 // 최대 6초까지 관찰. 그 이상은 진짜 실패로 간주한다.

export function AfterLoggingDemo() {
  const order = MOCK_ORDERS[0]
  const [isPending, startTransition] = useTransition()
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [result, setResult] = useState<SubmitOrderResult | null>(null)
  const [entry, setEntry] = useState<AuditLogEntry | null>(null)
  const pollAttempts = useRef(0)

  useEffect(() => {
    if (phase !== 'waiting-after' || !result) return
    let cancelled = false
    pollAttempts.current = 0

    const intervalId = setInterval(async () => {
      pollAttempts.current += 1
      const latest = await fetchAuditLogEntry(result.orderId)
      if (cancelled) return

      if (latest) setEntry(latest)

      if (latest?.afterCompletedAt != null) {
        setPhase('completed')
        clearInterval(intervalId)
      } else if (pollAttempts.current >= MAX_POLL_ATTEMPTS) {
        setPhase('timeout')
        clearInterval(intervalId)
      }
    }, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [phase, result])

  const handleSubmit = () => {
    setPhase('submitting')
    startTransition(async () => {
      const res = await submitOrder(order.orderNumber, order.finalAmount)
      setResult(res)
      setEntry({
        orderId: res.orderId,
        responseReturnedAt: res.responseReturnedAt,
        afterStartedAt: null,
        afterCompletedAt: null,
        maskedCardDigest: null,
      })
      setPhase('waiting-after')
    })
  }

  const handleReset = async () => {
    await resetAuditLog()
    setResult(null)
    setEntry(null)
    setPhase('idle')
  }

  const isBusy = isPending || phase === 'submitting' || phase === 'waiting-after'

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="after() 백그라운드 주문 로깅 실습">
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                결제 확정 후 감사 로그 백그라운드 기록
              </h4>
              <p className="text-zinc-500 text-[11px]">
                Server Action이 값을 반환한 뒤, after() 콜백이 카드 결제 식별자를 해시로 마스킹해
                감사 로그에 기록합니다.
              </p>
            </div>
            <DemoResetButton onReset={handleReset} disabled={isBusy} label="다시 실행" />
          </div>

          <div className="flex items-center justify-between rounded bg-zinc-50 p-3.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100">
                주문 결제 금액: {order.finalAmount.toLocaleString()}원
              </div>
              <div className="text-zinc-500 text-[11px]">주문번호: {order.orderNumber}</div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isBusy}
              className="rounded bg-emerald-600 px-4 py-2 font-bold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              {phase === 'submitting'
                ? 'Server Action 실행 중...'
                : phase === 'waiting-after'
                ? 'after() 콜백 관찰 중...'
                : '최종 결제 승인 요청'}
            </button>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">
              서버 타임스탬프 타임라인 (실측):
            </span>
            <div className="space-y-1.5 font-mono">
              {!result ? (
                <div className="text-zinc-400 p-2">
                  결제 승인 버튼을 누르면 실제 서버 타임스탬프가 기록됩니다.
                </div>
              ) : (
                <>
                  <div className="p-2 rounded bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 font-bold">
                    <span className="text-zinc-400 mr-2">[T1]</span>
                    {formatTimestamp(result.responseReturnedAt)} — Server Action 반환, 클라이언트
                    응답 수신
                  </div>
                  <div className="p-2 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <span className="text-zinc-400 mr-2">[T2]</span>
                    {formatTimestamp(entry?.afterStartedAt ?? null)} — after() 콜백 실행 시작
                  </div>
                  <div className="p-2 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <span className="text-zinc-400 mr-2">[T3]</span>
                    {formatTimestamp(entry?.afterCompletedAt ?? null)} — 카드 정보 해시 마스킹 완료,
                    감사 로그 기록 완료
                    {entry?.maskedCardDigest && (
                      <span className="ml-1.5 text-zinc-400">
                        (digest: {entry.maskedCardDigest.slice(0, 8)}…)
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter phase={phase} result={result} entry={entry} />
    </div>
  )
}
