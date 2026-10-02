'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { IndicatorProbe } from '../types'

interface Props {
  probes: IndicatorProbe[]
  onMeasure: () => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'

export function IndicatorProbePanel({ probes, onMeasure, onReset }: Props) {
  const latest = probes[0]
  return (
    <section className="min-w-0 space-y-3" aria-label="표시기 DOM 측정">
      <h3 className="font-semibold">현재 화면의 개발 표시기 (실측)</h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        dev 서버로 열었다면 이 문서의 왼쪽 아래에 Next.js 로고 버튼이 있습니다. 버튼을 눌러 Dev Tools 메뉴를 연 상태에서 측정하면
        메뉴의 Route 항목 값도 함께 읽습니다.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onMeasure} className={btn}>표시기 측정</button>
        <DemoResetButton label="측정 기록 초기화" onReset={onReset} />
      </div>
      <div className="min-w-0 space-y-1 rounded border border-zinc-200 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 dark:border-zinc-800">
        {latest ? (
          <>
            <div>NODE_ENV(클라이언트 번들): <span className="text-sky-400">{latest.nodeEnv}</span> · iframe 안: {latest.inIframe ? '예' : '아니요'}</div>
            <div>document의 &lt;nextjs-portal&gt; 수: <span className="text-emerald-400">{latest.portalCount}</span> · shadowRoot 읽기: {latest.shadowReadable ? '가능(open)' : '불가'}</div>
            <div className="break-words">
              표시기 요소: {latest.indicatorFound && latest.rect
                ? `있음 · x ${latest.rect.x}, y ${latest.rect.y}, ${latest.rect.width}×${latest.rect.height}px`
                : '없음'}
              {' '}· 뷰포트 {latest.viewport.width}×{latest.viewport.height}
            </div>
            <div>사분면: <span className="text-amber-400">{latest.corner ?? '-'}</span></div>
            <div>Dev Tools 메뉴 Route 값: {latest.routeType ?? '메뉴가 닫혀 있어 읽지 못함'}</div>
            <div className="border-t border-zinc-800 pt-1">측정 {probes.length}회 · 최신 {latest.measuredAt}</div>
          </>
        ) : (
          <div className="text-zinc-500">[표시기 측정]을 누르기 전입니다.</div>
        )}
      </div>
    </section>
  )
}
