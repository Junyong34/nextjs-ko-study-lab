'use client'

import React, { useState } from 'react'

export function ParallelIndependentTabsDemo() {
  const [dashboardTab, setDashboardTab] = useState<'summary' | 'sales' | 'alerts'>('summary')
  const [metricsRange, setMetricsRange] = useState<'24h' | '7d' | '30d'>('7d')

  return (
    <div className="space-y-4">
      {/* 병렬 슬롯 2단 레이아웃 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 슬롯 1: @dashboard */}
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
          <div className="flex items-center justify-between border-b border-blue-200/60 pb-2 dark:border-blue-900/60">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-blue-500" />
              <span className="font-mono text-xs font-bold text-blue-950 dark:text-blue-200">
                슬롯 1: @dashboard
              </span>
            </div>
            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
              Active: /{dashboardTab}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'summary', label: '요약 지표' },
              { id: 'sales', label: '매출 추이' },
              { id: 'alerts', label: '재고 알림' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDashboardTab(tab.id as any)}
                className={`rounded px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  dashboardTab === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-zinc-700 hover:bg-blue-100/60 dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded bg-white p-3 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 border border-blue-100 dark:border-blue-950">
            {dashboardTab === 'summary' && (
              <div>
                <div className="font-bold text-blue-600 dark:text-blue-400">📊 오늘 주문 건수: 142건</div>
                <div className="text-zinc-500 mt-1">평균 결제 금액: 48,200원 (전일 대비 +12%)</div>
              </div>
            )}
            {dashboardTab === 'sales' && (
              <div>
                <div className="font-bold text-blue-600 dark:text-blue-400">📈 실시간 매출: 6,844,400원</div>
                <div className="text-zinc-500 mt-1">목표 달성률: 94.2% (정산 대기 3건)</div>
              </div>
            )}
            {dashboardTab === 'alerts' && (
              <div>
                <div className="font-bold text-amber-600 dark:text-amber-400">⚠️ 재고 위험 상품: 2건</div>
                <div className="text-zinc-500 mt-1">초경량 러닝화 (남은 재고 3개)</div>
              </div>
            )}
          </div>
        </div>

        {/* 슬롯 2: @metrics */}
        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 dark:border-emerald-900/60">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-bold text-emerald-950 dark:text-emerald-200">
                슬롯 2: @metrics
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              Active: /{metricsRange}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: '24h', label: '일간 (24h)' },
              { id: '7d', label: '주간 (7d)' },
              { id: '30d', label: '월간 (30d)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMetricsRange(tab.id as any)}
                className={`rounded px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  metricsRange === tab.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-zinc-700 hover:bg-emerald-100/60 dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded bg-white p-3 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 border border-emerald-100 dark:border-emerald-950">
            {metricsRange === '24h' && (
              <div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">⚡ 24h 트래픽: 18,400 UV</div>
                <div className="text-zinc-500 mt-1">장바구니 전환율: 4.8%</div>
              </div>
            )}
            {metricsRange === '7d' && (
              <div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">📊 7d 누적 트래픽: 114,200 UV</div>
                <div className="text-zinc-500 mt-1">신규 회원 유입: +1,240명</div>
              </div>
            )}
            {metricsRange === '30d' && (
              <div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">🏆 30d 총 매출: 198,400,000원</div>
                <div className="text-zinc-500 mt-1">반품률: 1.2% (전월 대비 개선)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
