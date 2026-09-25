'use client'

import React from 'react'
import { DemoPlaygroundCard, DemoResetButton, ExpectedActualPanel } from '@study/demo-kit'
import { useEdgeLab } from '../hooks/useEdgeLab'
import { EXPECTED_LINES, evaluate } from '../expectations'
import { ApiCheckTable, DigestCompare } from './ApiCheckTable'
import { StreamTimeline } from './StreamTimeline'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 space-y-2">
      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
      {children}
    </section>
  )
}

export function WebApisLab() {
  const { input, setInput, state, run, reset } = useEdgeLab()
  const running = state.status === 'running'
  const { verdicts, isMatched } = evaluate(state)

  const runtimeLine =
    state.status === 'done'
      ? `NEXT_RUNTIME=${state.probe.nextRuntime} · typeof EdgeRuntime=${state.probe.edgeRuntimeGlobal} · 핸들러 실행 ${state.probe.handlerMs}ms · ${state.probe.measuredAt}`
      : null

  const actual =
    state.status === 'done'
      ? verdicts.map((v) => `• ${v.label}: ${v.detail} → ${v.ok ? '일치' : '불일치'}`).join('\n')
      : state.status === 'error'
        ? `• 요청 실패: ${state.message}`
        : state.status === 'running'
          ? `• 측정 중… stream 청크 ${state.chunks.length}개 수신`
          : '• 측정 대기 중'

  return (
    <>
      <DemoPlaygroundCard title="edge Route Handler(probe · stream)에 같은 입력을 보내 Web API 결과 받기" className="min-w-0">
        <div className="min-w-0 space-y-5">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              void run(input)
            }}
          >
            <label className="sr-only" htmlFor="edge-input">
              입력 문자열
            </label>
            <input
              id="edge-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs text-zinc-900 focus:border-zinc-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={running}
              className="rounded-md bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {running ? '측정 중...' : 'Edge에서 실행'}
            </button>
            <DemoResetButton onReset={reset} disabled={running} />
          </form>

          <p className="text-[11px] text-zinc-500">
            <code>./probe</code>와 <code>./stream</code>은 모두 <code>export const runtime = &apos;edge&apos;</code>인 route.ts입니다.
            입력은 <code>URLSearchParams</code>로 쿼리에 실려 실제 HTTP 요청으로 전달됩니다.
          </p>

          {runtimeLine && (
            <div className="break-all rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {runtimeLine}
            </div>
          )}

          {state.status === 'done' && (
            <>
              <Section title="1. Edge 라우트 안에서 실행한 Web API (probe 응답)">
                <ApiCheckTable probe={state.probe} />
              </Section>
              <Section title="2. 같은 입력을 브라우저 Web API로 계산해 대조">
                <DigestCompare probe={state.probe} browser={state.browser} />
              </Section>
            </>
          )}

          {(state.status === 'running' || state.status === 'done') && (
            <Section title="3. ReadableStream → TransformStream → TextEncoderStream 스트리밍 응답 (stream)">
              <StreamTimeline
                chunks={state.status === 'done' ? state.stream.chunks : state.chunks}
                headersAtMs={state.status === 'done' ? state.stream.headersAtMs : undefined}
              />
            </Section>
          )}

          {state.status === 'error' && (
            <p className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              {state.message}
            </p>
          )}
        </div>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="Edge Runtime에서 Web 표준 API 실제 동작"
        expected={<span className="whitespace-pre-line">{EXPECTED_LINES.join('\n')}</span>}
        actual={<span className="whitespace-pre-line">{actual}</span>}
        isMatched={isMatched}
        description="값은 모두 edge Route Handler의 실제 응답과 브라우저의 실제 계산 결과입니다. 여섯 항목이 모두 일치해야 검증 완료로 표시됩니다."
      />
    </>
  )
}
