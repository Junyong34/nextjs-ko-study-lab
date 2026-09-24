'use client'

import React from 'react'
import type { SdkEvent, SdkEventKind } from '../types'

const KIND_LABEL: Record<SdkEventKind, string> = {
  mount: '마운트',
  'early-call': '마운트 직후 호출',
  'manual-call': '직접 호출',
  onLoad: 'onLoad',
  onReady: 'onReady',
  onError: 'onError',
  away: '하위 라우트 진입',
}

function rowTone(e: SdkEvent) {
  if (e.kind === 'onError' || e.ok === false) return 'text-rose-600 dark:text-rose-400'
  if (e.kind === 'onLoad') return 'text-emerald-600 dark:text-emerald-400'
  if (e.kind === 'onReady') return 'text-blue-600 dark:text-blue-400'
  if (e.kind === 'away') return 'text-purple-600 dark:text-purple-400'
  return 'text-zinc-600 dark:text-zinc-400'
}

/** 모듈 스코프 로그를 발생 순서 그대로 보여준다. 값은 전부 콜백·호출 시점의 실측값이다. */
export function CallbackTimeline({ events }: { events: SdkEvent[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
        콜백 수명주기 로그 (performance.now() 기준, 실제 발생 순)
      </div>
      {events.length === 0 ? (
        <p className="font-mono text-[11px] text-zinc-400">기록 대기 중...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] font-mono text-[11px]">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                <th className="py-1 pr-2 font-medium">#</th>
                <th className="py-1 pr-2 font-medium">t(ms)</th>
                <th className="py-1 pr-2 font-medium">이벤트</th>
                <th className="py-1 pr-2 font-medium">대상</th>
                <th className="py-1 pr-2 font-medium">마운트</th>
                <th className="py-1 pr-2 font-medium">window.DemoPay</th>
                <th className="py-1 font-medium">상세</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.seq} className={`border-b border-zinc-100 align-top dark:border-zinc-900 ${rowTone(e)}`}>
                  <td className="py-1 pr-2">{e.seq}</td>
                  <td className="py-1 pr-2">{e.at.toFixed(1)}</td>
                  <td className="py-1 pr-2 font-semibold">{KIND_LABEL[e.kind]}</td>
                  <td className="py-1 pr-2">{e.scope}</td>
                  <td className="py-1 pr-2">{e.mountNo}회차</td>
                  <td className="py-1 pr-2">{e.sdkPresent ? '있음' : '없음'}</td>
                  <td className="py-1 break-keep">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
