'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { LEGACY_LABEL, LEGACY_LATENCY_MS, LEGACY_SERVICES } from '../constants'
import type { BffOrderResponse, ScenarioKind, ScenarioResults } from '../types'
import { ScenarioTable } from './ScenarioTable'
import { ServerTimeline } from './ServerTimeline'

interface AggregationPlaygroundProps {
  results: ScenarioResults
  running: ScenarioKind | null
  error: string | null
  lastBff: BffOrderResponse | null
  onRun: (kind: ScenarioKind) => void
  onReset: () => void
}

export function AggregationPlayground({ results, running, error, lastBff, onRun, onReset }: AggregationPlaygroundProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">주문 상세 화면 = 레거시 API 3종의 데이터가 모두 필요</p>
          <p className="break-keep">
            레거시 API 지연은 <code>_lib/legacy.ts</code>가 <strong>서버 프로세스 안에서</strong> 실제로 기다리는 시간입니다:{' '}
            {LEGACY_SERVICES.map((s, i) => (
              <span key={s} className="font-mono">
                {LEGACY_LABEL[s]} {LEGACY_LATENCY_MS[s]}ms{i < LEGACY_SERVICES.length - 1 ? ' · ' : ''}
              </span>
            ))}
            . 표의 수치는 이 값을 복사한 것이 아니라 브라우저(Resource Timing, performance.now)와 서버(performance.now)가 각각 잰 값입니다.
          </p>
        </div>
        <DemoResetButton onReset={onReset} disabled={running !== null} />
      </div>

      <ScenarioTable results={results} running={running} onRun={onRun} />

      {error && (
        <p className="rounded border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">BFF 내부 레거시 호출 구간 (서버 측정, meta.spans)</h4>
          <ServerTimeline results={results} />
        </section>
        <section className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">BFF가 화면용으로 합쳐 보낸 응답 (마지막 BFF 호출)</h4>
          {lastBff ? (
            <div className="space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
              <div>
                주문 {lastBff.order.orderId} · {lastBff.order.statusLabel}
              </div>
              {lastBff.order.items.map((item) => (
                <div key={item.sku}>
                  - {item.sku} × {item.qty} (재고 {item.available}개)
                </div>
              ))}
              <div>
                배송 {lastBff.shipping.carrier} {lastBff.shipping.trackingNo} · {lastBff.shipping.statusLabel}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-zinc-500">BFF 시나리오를 실행하면 주문 + 재고 + 배송이 합쳐진 한 개의 JSON이 표시됩니다.</p>
          )}
        </section>
      </div>
    </div>
  )
}
