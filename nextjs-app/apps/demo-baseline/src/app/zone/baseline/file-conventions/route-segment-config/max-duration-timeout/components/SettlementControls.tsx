'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { SettlementLogEntry, SettlementSource } from '../types'
import { MAX_ORDER_COUNT, MIN_ORDER_COUNT } from '../types'

export interface SettlementControlsProps {
  orderCount: number
  onChangeOrderCount: (delta: number) => void
  pendingSource: SettlementSource | null
  pendingElapsedMs: number
  logs: SettlementLogEntry[]
  pageMaxDurationSeconds: number
  onRunServerAction: () => void
  onRunRouteHandler: () => void
  onReset: () => void
}

const LOG_TONE_STYLE: Record<SettlementLogEntry['tone'], string> = {
  info: 'text-zinc-400',
  success: 'text-emerald-400 font-semibold',
  warn: 'text-amber-400 font-semibold',
}

export function SettlementControls({
  orderCount,
  onChangeOrderCount,
  pendingSource,
  pendingElapsedMs,
  logs,
  pageMaxDurationSeconds,
  onRunServerAction,
  onRunRouteHandler,
  onReset,
}: SettlementControlsProps) {
  const isPending = pendingSource !== null

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">주문 정산 배치 콘솔</h4>
          <p className="text-xs text-zinc-500">
            선택한 주문 건수만큼 실제로 순차 정산 처리를 수행합니다 (건당 약 0.7초 실지연).
          </p>
        </div>
        <DemoResetButton onReset={onReset} label="실습 초기화" disabled={isPending} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">정산 대상 주문 건수</span>
            <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-mono dark:bg-zinc-800">
              {MIN_ORDER_COUNT} ~ {MAX_ORDER_COUNT}건
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeOrderCount(-1)}
              disabled={isPending || orderCount <= MIN_ORDER_COUNT}
              className="h-7 w-7 rounded bg-zinc-200 font-bold disabled:opacity-40 dark:bg-zinc-700 cursor-pointer"
            >
              -
            </button>
            <span className="w-10 text-center font-bold font-mono">{orderCount}</span>
            <button
              type="button"
              onClick={() => onChangeOrderCount(1)}
              disabled={isPending || orderCount >= MAX_ORDER_COUNT}
              className="h-7 w-7 rounded bg-zinc-200 font-bold disabled:opacity-40 dark:bg-zinc-700 cursor-pointer"
            >
              +
            </button>
            <span className="ml-auto text-[11px] text-zinc-500">
              페이지 maxDuration: {pageMaxDurationSeconds}초
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={onRunServerAction}
              disabled={isPending}
              className="w-full rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              {pendingSource === 'server-action' ? `정산 중... ${(pendingElapsedMs / 1000).toFixed(1)}초` : 'Server Action으로 정산 실행'}
            </button>
            <button
              type="button"
              onClick={onRunRouteHandler}
              disabled={isPending}
              className="w-full rounded border border-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              {pendingSource === 'route-handler' ? `정산 중... ${(pendingElapsedMs / 1000).toFixed(1)}초` : 'Route Handler로 정산 실행 (POST ./settle-batch)'}
            </button>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">실행 로그 (실측값):</div>
          <div className="space-y-1 pt-1 text-[11px] min-h-[4.5rem]">
            {logs.length === 0 && <div className="text-zinc-600">아직 실행하지 않았습니다.</div>}
            {logs.map((log) => (
              <div key={log.id} className={LOG_TONE_STYLE[log.tone]}>
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
