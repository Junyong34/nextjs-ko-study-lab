'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { FetchRun } from '../types'
import { fetchLogLines, URL_LIMIT } from '../lib/logLine'

interface Props {
  runs: FetchRun[]
  isPending: boolean
  onRerun: () => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'

export function FetchRunPanel({ runs, isPending, onRerun, onReset }: Props) {
  const latest = runs[0]
  return (
    <section className="min-w-0 space-y-3" aria-label="서버 fetch 실측">
      <h3 className="font-semibold">이 페이지가 렌더 중에 보낸 fetch (실측)</h3>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onRerun} disabled={isPending} className={btn}>
          {isPending ? '서버 렌더 중...' : '서버 렌더 다시 실행 (router.refresh)'}
        </button>
        <DemoResetButton label="실행 기록 초기화" onReset={onReset} />
      </div>

      {latest.ok ? (
        <div className="min-w-0 space-y-1.5 rounded border border-zinc-200 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 dark:border-zinc-800">
          <div className="break-all">요청 URL ({latest.url.length}자): <span className="text-emerald-400">{latest.url}</span></div>
          <div>상태 {latest.status} · 소요 {latest.durationMs}ms (서버에서 performance.now()로 측정) · NODE_ENV={latest.nodeEnv}</div>
          <div className="break-all">Route Handler가 받은 쿼리 ({latest.echo.receivedSearch.length}자): <span className="text-sky-400">{latest.echo.receivedSearch}</span></div>
          <div>Route Handler 요청 #{latest.echo.requestCount} · servedAt {latest.echo.servedAt}</div>
        </div>
      ) : (
        <p className="rounded border border-rose-300 p-3 text-xs text-rose-700 dark:border-rose-800 dark:text-rose-300">
          fetch 실패: {latest.error} ({latest.url})
        </p>
      )}

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        서버 렌더 실행 기록 {runs.length}회:{' '}
        {runs.map((run) => (run.ok ? `#${run.echo.requestCount}` : '실패')).join(' → ')}
      </p>

      {latest.ok && (
        <div className="min-w-0 space-y-2">
          <h4 className="text-xs font-semibold">같은 fetch가 터미널에 찍히는 모양 (규칙으로 계산, 터미널을 읽은 값 아님)</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Next.js 16.3.2의 dev 로그 코드(log-requests.js)에 있는 규칙에 실측 URL·상태·소요 시간을 넣어 계산했습니다.
            URL이 {URL_LIMIT}자를 넘고 fullUrl이 false면 호스트 16자·경로 24자·쿼리 16자에서 자릅니다.
          </p>
          {[
            { label: '설정 없음 (이 앱의 현재 상태)', lines: ['(fetch 줄이 출력되지 않음 — 요청 줄만 남음)'] },
            { label: 'logging: { fetches: {} }', lines: fetchLogLines(latest.url, latest.status, latest.durationMs, false) },
            { label: 'logging: { fetches: { fullUrl: true } }', lines: fetchLogLines(latest.url, latest.status, latest.durationMs, true) },
          ].map((variant) => (
            <div key={variant.label} className="min-w-0 space-y-1">
              <p className="font-mono text-xs font-medium">{variant.label}</p>
              <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-2 text-[11px] text-zinc-100">
                <code>{variant.lines.join('\n')}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
