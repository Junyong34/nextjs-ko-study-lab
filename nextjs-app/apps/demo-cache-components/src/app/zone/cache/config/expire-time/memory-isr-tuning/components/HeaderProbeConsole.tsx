'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { HeaderProbeState } from '../hooks/useHeaderProbe'
import { judgeTarget } from '../lib/judge'
import { TARGET_BASE, TARGETS } from '../types'

const VERDICT_STYLE = {
  match: 'text-emerald-700 dark:text-emerald-400',
  mismatch: 'text-rose-600 dark:text-rose-400',
  undetermined: 'text-zinc-500',
} as const

const VERDICT_LABEL = { match: '일치', mismatch: '불일치', undetermined: '판정 불가' } as const

export function HeaderProbeConsole({ probe, nodeEnv }: { probe: HeaderProbeState; nodeEnv: string }) {
  const isProduction = nodeEnv === 'production'
  return (
    <section className="min-w-0 space-y-3" aria-label="Cache-Control 실측">
      <h3 className="font-semibold">현재 설정(expireTime 미설정)의 Cache-Control 실측</h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        [헤더 측정]은 브라우저가 아래 세 대상 라우트를 실제로 요청하고 받은 응답 헤더를 그대로 보여 줍니다. 이 화면을 렌더링한 서버의
        NODE_ENV는 <span className="font-mono">{nodeEnv}</span>입니다.{' '}
        {isProduction
          ? 'production 서버이므로 기본 expireTime(31536000초)이 헤더에 반영되는지 판정합니다.'
          : 'next dev는 모든 페이지에 Cache-Control: no-cache, must-revalidate를 보내므로 헤더는 기록하되 판정하지 않습니다. next build 후 next start로 열어야 판정됩니다.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={probe.measure}
          disabled={probe.isPending}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {probe.isPending ? '측정 중…' : '헤더 측정'}
        </button>
        <DemoResetButton label="측정 초기화" onReset={probe.reset} />
      </div>
      {probe.error && <p className="text-xs text-rose-600 dark:text-rose-400">요청 실패: {probe.error}</p>}
      <div className="space-y-3">
        {TARGETS.map((target) => {
          const reading = probe.readings[target.key]
          const { verdict, reason } = judgeTarget(target, reading, nodeEnv)
          return (
            <div key={target.key} className="min-w-0 space-y-1.5 rounded border border-zinc-200 p-3 text-xs dark:border-zinc-800">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-medium">{target.label}</h4>
                <span className={`font-medium ${VERDICT_STYLE[verdict]}`}>{reading ? VERDICT_LABEL[verdict] : '대기'}</span>
              </div>
              <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-2 text-[11px] text-zinc-100">
                <code>{target.code}</code>
              </pre>
              <p className="break-all text-zinc-500">
                대상: <a href={`${TARGET_BASE}/${target.key}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">{`${TARGET_BASE}/${target.key}`}</a>
              </p>
              <p>
                production 기대:{' '}
                <span className="font-mono">
                  {target.expected ? `s-maxage=${target.expected.sMaxage}, stale-while-revalidate=${target.expected.swr}` : 's-maxage 없음'}
                </span>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">{target.why}</p>
              {reading && (
                <div className="space-y-1 border-t border-zinc-200 pt-1.5 dark:border-zinc-800">
                  <p>
                    실제 ({reading.status}): <span className="break-all font-mono">Cache-Control: {reading.cacheControl ?? '(없음)'}</span>
                  </p>
                  {reading.nextHeaders.map((header) => (
                    <p key={header} className="break-all font-mono text-zinc-500">{header}</p>
                  ))}
                  <p className={VERDICT_STYLE[verdict]}>{reason}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
