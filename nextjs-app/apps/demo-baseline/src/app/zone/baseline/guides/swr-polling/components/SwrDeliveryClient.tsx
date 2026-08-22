'use client'

import React, { useState, useEffect } from 'react'
import type { DeliveryStatus } from '../types'

const STAGES = [
  { status: 'payment_done', label: '결제 완료', location: '서울 물류센터 접수' },
  { status: 'preparing', label: '상품 포장 중', location: '김포 자동화 메가허브' },
  { status: 'in_transit', label: '간선 배송 중', location: '대전 Hub 터미널 이동' },
  { status: 'delivered', label: '배송 완료', location: '고객님 문 앞 배송 완료' },
] as const

export function SwrDeliveryClient() {
  const [stageIndex, setStageIndex] = useState(0)
  const [pollCount, setPollCount] = useState(1)
  const [isAutoPolling, setIsAutoPolling] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<string>('')

  useEffect(() => {
    setLastFetchTime(new Date().toLocaleTimeString('ko-KR'))
  }, [])

  useEffect(() => {
    if (!isAutoPolling) return

    const timer = setInterval(() => {
      setPollCount((prev) => prev + 1)
      setLastFetchTime(new Date().toLocaleTimeString('ko-KR'))
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev))
    }, 2500)

    return () => clearInterval(timer)
  }, [isAutoPolling])

  const currentStage = STAGES[stageIndex]

  const handleManualMutate = () => {
    setPollCount((prev) => prev + 1)
    setLastFetchTime(new Date().toLocaleTimeString('ko-KR'))
    setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="space-y-4">
      {/* 1. 폴링 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            SWR 자동 폴링 (refreshInterval: 2500ms):
          </span>
          <button
            type="button"
            onClick={() => setIsAutoPolling((p) => !p)}
            className={`rounded px-2.5 py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
              isAutoPolling
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {isAutoPolling ? '● 자동 폴링 중' : '⏸ 일시 정지'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleManualMutate}
          className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          mutate() 즉시 수동 갱신
        </button>
      </div>

      {/* 2. 배송 단계 타임라인 */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              실시간 배송 조회 (운송장: #TRK-2026-8831)
            </h4>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              현재 위치: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{currentStage.location}</span>
            </div>
          </div>
          <div className="text-right font-mono text-[11px] text-zinc-400">
            <div>총 폴링 횟수: {pollCount}회</div>
            <div>최근 수신: {lastFetchTime}</div>
          </div>
        </div>

        {/* 4단계 스텝 인디케이터 */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STAGES.map((s, idx) => {
            const isCompleted = idx <= stageIndex
            const isCurrent = idx === stageIndex

            return (
              <div
                key={s.status}
                className={`rounded border p-2.5 text-center transition ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-2xs'
                    : isCompleted
                    ? 'border-zinc-300 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                    : 'border-zinc-200 bg-white text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 opacity-40'
                }`}
              >
                <div className="font-mono text-[10px] font-bold">
                  STEP {idx + 1}
                </div>
                <div className="text-xs font-bold mt-0.5">{s.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
