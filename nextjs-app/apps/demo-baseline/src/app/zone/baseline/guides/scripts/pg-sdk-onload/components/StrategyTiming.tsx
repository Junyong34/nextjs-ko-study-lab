'use client'

import React from 'react'
import Script from 'next/script'
import { readBootTiming } from '../lib/timing'
import { SDK_ROUTE, type BootTiming } from '../types'

const AFTER_SRC = `${SDK_ROUTE}?name=probe&id=after`
const LAZY_SRC = `${SDK_ROUTE}?name=probe&id=lazy`

const fmt = (value: number | null) => (value === null ? '-' : `${Math.round(value)}ms`)

/**
 * 페이지 로드와 함께 마운트되는 두 <Script>의 strategy 차이를 실측한다.
 * afterInteractive는 하이드레이션 직후, lazyOnload는 window load 이후 유휴 시간에 요청이 시작된다.
 * (beforeInteractive는 루트 레이아웃에서만 쓸 수 있어 이 데모 페이지에서는 마운트하지 않는다.)
 */
export function StrategyTiming({ timing, onTiming }: { timing: BootTiming | null; onTiming: (t: BootTiming) => void }) {
  const report = () => onTiming(readBootTiming(AFTER_SRC, LAZY_SRC))

  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <Script id="pg-boot-after" src={AFTER_SRC} strategy="afterInteractive" onLoad={report} />
      <Script id="pg-boot-lazy" src={LAZY_SRC} strategy="lazyOnload" onLoad={report} />
      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">1. 페이지 로드 시 strategy별 요청 시각</div>
      <table className="w-full text-left font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
        <thead>
          <tr className="text-zinc-500">
            <th className="py-0.5 font-medium">strategy</th>
            <th className="font-medium">요청 시작</th>
            <th className="font-medium">실행</th>
            <th className="font-medium">window load 시작</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-0.5">afterInteractive</td>
            <td>{fmt(timing?.afterInteractiveRequestStart ?? null)}</td>
            <td>{fmt(timing?.afterInteractiveExecutedAt ?? null)}</td>
            <td rowSpan={2}>{timing ? fmt(timing.loadEventStart) : '-'}</td>
          </tr>
          <tr>
            <td className="py-0.5">lazyOnload</td>
            <td>{fmt(timing?.lazyOnloadRequestStart ?? null)}</td>
            <td>{fmt(timing?.lazyOnloadExecutedAt ?? null)}</td>
          </tr>
        </tbody>
      </table>
      {!timing && <p className="text-[11px] text-zinc-500">두 스크립트가 실행될 때까지 측정 중입니다.</p>}
    </div>
  )
}
