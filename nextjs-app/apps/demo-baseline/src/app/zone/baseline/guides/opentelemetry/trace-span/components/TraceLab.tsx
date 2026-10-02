'use client'

import React from 'react'
import { DemoPlaygroundCard, DemoResetButton, ExpectedActualPanel } from '@study/demo-kit'
import { useTraceCollector } from '../hooks/useTraceCollector'
import { judge, short } from '../expectations'
import type { ServerTraceProbe } from '../types'
import { SpanTree } from './SpanTree'

const BTN =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'
const BTN_SUB =
  'rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="break-all">{value}</dd>
    </>
  )
}

export function TraceLab({ probe }: { probe: ServerTraceProbe }) {
  const { spans, direct, refreshing, collect, callDirect, clearDirect, refresh, reset } = useTraceCollector(probe.traceId)
  const verdict = judge(probe, spans, direct)

  return (
    <>
      <DemoPlaygroundCard title="이 페이지 요청의 trace (page.tsx → demo.child → echo/route.ts)">
        <div className="space-y-3 text-sm">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
            <Row label="활성 traceId" value={probe.traceId ?? '없음'} />
            <Row label="활성 spanId" value={probe.activeSpanId ?? '없음'} />
            <Row label="demo.child spanId" value={probe.childSpanId ?? '없음'} />
            <Row label="echo가 받은 traceparent" value={probe.echo?.traceparent ?? probe.echoError ?? '없음'} />
            <Row label="echo의 활성 traceId" value={probe.echo?.traceId ?? '없음'} />
            <Row label="렌더링 시각" value={probe.renderedAt} />
          </dl>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={BTN} onClick={collect} disabled={spans.status === 'loading'}>
              이 요청의 span 수집
            </button>
            <button type="button" className={BTN_SUB} onClick={refresh} disabled={refreshing}>
              {refreshing ? '요청 중...' : '새 요청 보내기 (router.refresh)'}
            </button>
            {direct.status === 'idle' ? (
              <button type="button" className={BTN_SUB} onClick={callDirect}>
                브라우저에서 echo 직접 호출
              </button>
            ) : (
              <button type="button" className={BTN_SUB} onClick={clearDirect}>
                서버 경유 결과로 되돌리기
              </button>
            )}
            <DemoResetButton onReset={reset} className="ml-auto" />
          </div>
          {direct.status === 'ok' && (
            <p className="rounded border border-amber-300 bg-amber-50 p-2 font-mono text-[11px] text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              브라우저 → echo: traceparent={direct.data.traceparent ?? '없음'}, echo traceId={short(direct.data.traceId)} (페이지
              traceId={short(probe.traceId)})
            </p>
          )}
          <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
            {spans.status === 'idle' && <p className="text-xs text-zinc-500">아직 span을 수집하지 않았습니다.</p>}
            {spans.status === 'loading' && <p className="text-xs text-zinc-500">링버퍼에서 읽는 중...</p>}
            {spans.status === 'error' && <p className="text-xs text-rose-600">수집 실패: {spans.message}</p>}
            {spans.status === 'ok' && (
              <div className="space-y-2">
                <p className="text-[11px] text-zinc-500">
                  링버퍼 {spans.data.total}/{spans.data.limit}개 · 추적 중인 trace {spans.data.trackedTraceCount}개 · 밀려난 span{' '}
                  {spans.data.droppedCount}개{spans.data.installed ? '' : ' · 계측 미등록'}
                </p>
                <SpanTree spans={spans.data.spans} probe={probe} />
              </div>
            )}
          </div>
        </div>
      </DemoPlaygroundCard>
      <ExpectedActualPanel
        title="Trace ID 전파와 커스텀 span 부모 관계 검증"
        expected={
          <ul className="space-y-1 font-mono text-[11px]">
            {verdict.checks.map((c) => (
              <li key={c.label}>• {c.label}: {c.expected}</li>
            ))}
          </ul>
        }
        actual={
          <ul className="space-y-1 font-mono text-[11px]">
            {verdict.checks.map((c) => (
              <li key={c.label} className={c.ok === false ? 'text-rose-600' : undefined}>
                • [{c.ok === undefined ? '대기' : c.ok ? '일치' : '불일치'}] {c.actual}
              </li>
            ))}
          </ul>
        }
        isMatched={verdict.isMatched}
        description={verdict.description}
      />
    </>
  )
}
