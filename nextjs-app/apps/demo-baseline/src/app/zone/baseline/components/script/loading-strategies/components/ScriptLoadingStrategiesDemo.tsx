'use client'
import React from 'react'
import Script from 'next/script'
import { DemoResetButton } from '@study/demo-kit'
import { STRATEGY_LABEL, TIMING_SCRIPT_PATH } from '../types'
import type { ScriptLoadEvent, ScriptStrategy } from '../types'

export interface ScriptLoadingStrategiesDemoProps {
  hydratedAt: number | null
  events: ScriptLoadEvent[]
  workerTimedOut: boolean
}

const STRATEGY_CARDS: { key: ScriptStrategy; usage: string; note: string }[] = [
  { key: 'beforeInteractive', usage: '봇 감지 / 쿠키 동의 관리자 같은 최우선 필수 스크립트', note: 'HTML에 직접 주입되어 Next.js 코드보다 먼저 다운로드·실행됩니다.' },
  { key: 'afterInteractive', usage: '태그 매니저 / 애널리틱스 등 곧바로 필요한 스크립트', note: '하이드레이션이 일부(또는 전부) 끝난 뒤 로드되는 기본 전략입니다.' },
  { key: 'lazyOnload', usage: '채팅 위젯 / 소셜 위젯 등 급하지 않은 스크립트', note: '모든 리소스가 끝난 뒤 브라우저 유휴 시간에 로드됩니다.' },
  { key: 'worker', usage: '무거운 추적 스크립트를 메인 스레드 밖으로', note: 'Partytown 웹 워커로 오프로딩하는 실험적 전략 — App Router에선 아직 미지원입니다.' },
]

function buildTimingScriptUrl(strategy: ScriptStrategy) {
  return `${TIMING_SCRIPT_PATH}?strategy=${strategy}`
}

const WORKER_TIMEOUT_LABEL =
  '4초 대기 후에도 로드 이벤트 미수신 → DevTools Network에도 이 요청이 잡히지 않음(preload/큐잉 자체가 생략됨, App Router 미지원이 실측으로 확인됨)'

/**
 * 4개 strategy의 next/script를 실제로 동시에 마운트한다. 각 스크립트는 이 데모 전용
 * timing-script Route Handler(순수 로컬 JS, 외부 CDN 아님)를 실제로 GET하고,
 * 실행되는 순간 window 커스텀 이벤트로 performance.now() 실측값을 보고한다.
 * beforeInteractive는 원칙상 루트 layout.tsx 배치가 권장되지만, 이번 작업 범위가
 * 이 라우트 디렉터리로 제한돼 있어 같은 세그먼트의 page.tsx 트리에 배치했다.
 * head 우선 주입·hydration 비차단이라는 핵심 동작은 이 위치에서도 동일하게 관찰된다.
 */
export function ScriptLoadingStrategiesDemo({ hydratedAt, events, workerTimedOut }: ScriptLoadingStrategiesDemoProps) {
  const timelineRows = [
    ...(hydratedAt !== null ? [{ kind: 'hydration' as const, atMs: hydratedAt }] : []),
    ...events.map((e) => ({ kind: 'script' as const, atMs: e.loadedAt, event: e })),
  ].sort((a, b) => a.atMs - b.atMs)

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      {STRATEGY_CARDS.map((s) => (
        <Script key={s.key} src={buildTimingScriptUrl(s.key)} strategy={s.key} id={`timing-script-${s.key}`} />
      ))}

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">4가지 strategy를 동시에 실제 로드 중</h4>
          <p className="text-zinc-500 text-[11px]">새로고침해야 처음부터 다시 측정됩니다 (스크립트는 next/script 캐시로 1회만 실행).</p>
        </div>
        <DemoResetButton label="다시 측정 (새로고침)" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {STRATEGY_CARDS.map((s) => {
          const fired = events.find((e) => e.strategy === s.key)
          return (
            <div key={s.key} className="p-3 rounded border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">{STRATEGY_LABEL[s.key]}</span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                    fired
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  {fired ? `${fired.loadedAt.toFixed(1)}ms` : s.key === 'worker' && workerTimedOut ? '미실행 확정' : '대기 중'}
                </span>
              </div>
              <div className="text-zinc-900 dark:text-zinc-100 font-medium mt-1">{s.usage}</div>
              <div className="text-zinc-500 text-[10px] mt-1">{s.note}</div>
            </div>
          )
        })}
      </div>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 font-mono space-y-1">
        <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">실측 타임라인 (performance.now() 기준, 실제 발생 순)</div>
        {timelineRows.length === 0 ? (
          <div className="text-zinc-400">측정 대기 중...</div>
        ) : (
          timelineRows.map((row, i) =>
            row.kind === 'hydration' ? (
              <div key="hydration" className="text-purple-600 dark:text-purple-400">
                {i + 1}. [hydration 완료] t={row.atMs.toFixed(1)}ms
              </div>
            ) : (
              <div key={row.event.strategy} className="text-emerald-600 dark:text-emerald-400">
                {i + 1}. [{row.event.strategy}] t={row.atMs.toFixed(1)}ms (readyState: {row.event.readyState})
              </div>
            )
          )
        )}
        {workerTimedOut && !events.some((e) => e.strategy === 'worker') && (
          <div className="text-amber-600 dark:text-amber-400">
            worker: {WORKER_TIMEOUT_LABEL}
          </div>
        )}
      </div>
    </div>
  )
}
