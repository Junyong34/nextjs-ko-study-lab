'use client'

import React from 'react'
import { TRIAL_ORDERS, type ActiveTrial, type PayAttempt, type TrialOrder, type TrialResult } from '../types'

const ORDER_LABEL: Record<TrialOrder, string> = {
  parallel: 'SDK와 플러그인 동시 마운트',
  chained: '플러그인을 SDK onLoad 뒤에 마운트',
  error: 'SDK HTTP 500',
}

interface TrialPanelProps {
  active: ActiveTrial | null
  trials: Partial<Record<TrialOrder, TrialResult>>
  sdkLoaded: boolean
  payAttempts: PayAttempt[]
  onStart: (order: TrialOrder) => void
  onPay: () => void
}

const btn = 'cursor-pointer rounded px-3 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40'

export function TrialPanel({ active, trials, sdkLoaded, payAttempts, onStart, onPay }: TrialPanelProps) {
  const current = active ? trials[active.order] : undefined

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">2. SDK 의존 플러그인 순서와 결제 호출 가드</div>
      <div className="flex flex-wrap gap-2">
        {TRIAL_ORDERS.map((order) => (
          <button key={order} type="button" onClick={() => onStart(order)} className={`${btn} bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900`}>
            [{order}] {ORDER_LABEL[order]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <button type="button" onClick={onPay} disabled={!active} className={`${btn} bg-rose-600 text-white hover:bg-rose-700`}>
          가드 없이 결제 요청
        </button>
        <button type="button" onClick={onPay} disabled={!sdkLoaded} className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}>
          결제 요청 (onLoad 이후에만 활성)
        </button>
        <span className="text-[11px] text-zinc-500">
          SDK 상태: {!active ? '시도 전' : sdkLoaded ? 'onLoad 완료' : '로딩 중 (1200ms 지연)'}
        </span>
      </div>

      {payAttempts.length > 0 && (
        <ul className="space-y-0.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
          {payAttempts.map((a) => (
            <li key={a.seq} className={a.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              #{a.seq} onLoad {a.afterOnLoad ? '이후' : '이전'} 호출 → {a.detail}
            </li>
          ))}
        </ul>
      )}

      {current ? (
        <table className="w-full text-left font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
          <thead>
            <tr className="text-zinc-500">
              <th className="py-0.5 font-medium">#</th>
              <th className="font-medium">시각</th>
              <th className="font-medium">이벤트</th>
              <th className="font-medium">PgSdk</th>
              <th className="font-medium">설명</th>
            </tr>
          </thead>
          <tbody>
            {current.events.map((e) => (
              <tr key={e.seq}>
                <td className="py-0.5">{e.seq}</td>
                <td>{e.at}ms</td>
                <td>{e.kind}</td>
                <td>{e.sdkPresent ? '있음' : '없음'}</td>
                <td className="font-sans">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-[11px] text-zinc-500">시도를 시작하면 onLoad/onReady/onError 호출 시각과 그 순간의 window.PgSdk 존재 여부가 여기에 기록됩니다.</p>
      )}
    </div>
  )
}
