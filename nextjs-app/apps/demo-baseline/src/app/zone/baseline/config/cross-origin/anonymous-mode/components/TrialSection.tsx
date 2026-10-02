'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { CORS_LABEL, TRIALS } from '../lib/trials'
import { isMasked, trialMismatches } from '../lib/judge'
import type { TrialResult, TrialSpec } from '../types'

interface Props {
  origin: string | null | undefined
  results: Record<string, TrialResult>
  running: string | null
  onRunAll: () => void
  onRun: (spec: TrialSpec) => void
  onReset: () => void
}

const BUTTON =
  'rounded border border-zinc-300 px-2.5 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700'

export function TrialSection({ origin, results, running, onRunAll, onRun, onReset }: Props) {
  const disabled = !origin || running !== null
  return (
    <section className="min-w-0 space-y-3" aria-label="crossorigin 속성의 의미 실측">
      <h3 className="font-semibold">2. 설정이 붙이는 속성의 의미 실측 — &lt;Script crossOrigin&gt;</h3>
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        next.config 설정이 아니라 컴포넌트 prop으로 같은 속성을 붙여, 다른 출처에서 받은 스크립트가 어떻게 처리되는지 봅니다.
        스크립트는 이 데모의 Route Handler(<code>probe/route.ts</code>)가 응답하며 마지막 줄에서 일부러 오류를 던집니다.
        차단되는 조합에서는 브라우저 콘솔에 CORS 차단 메시지가 찍히는 것이 정상입니다.
      </p>
      <p className="break-all rounded bg-zinc-50 p-2 font-mono text-[11px] dark:bg-zinc-900">
        {origin === undefined
          ? '스크립트 출처 확인 중…'
          : origin === null
            ? '다른 출처 주소를 만들 수 없는 호스트입니다(localhost 또는 127.0.0.1에서만 실행 가능). 이 환경에서는 판정 불가입니다.'
            : `스크립트 출처: ${origin} (현재 페이지와 호스트 표기가 달라 다른 출처)`}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={disabled} onClick={onRunAll} className={`${BUTTON} bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`}>
          다섯 조합 모두 실행
        </button>
        <DemoResetButton label="실측 초기화" onReset={onReset} />
      </div>
      <ul className="grid gap-2 md:grid-cols-2">
        {TRIALS.map((spec) => (
          <TrialCard key={spec.id} spec={spec} result={results[spec.id]} running={running === spec.id} disabled={disabled} onRun={() => onRun(spec)} />
        ))}
      </ul>
    </section>
  )
}

function TrialCard({ spec, result, running, disabled, onRun }: { spec: TrialSpec; result?: TrialResult; running: boolean; disabled: boolean; onRun: () => void }) {
  const mismatches = result ? trialMismatches(spec, result) : []
  const tone = !result ? 'border-zinc-200 dark:border-zinc-800' : mismatches.length === 0 ? 'border-emerald-300 dark:border-emerald-800' : 'border-rose-300 dark:border-rose-800'
  return (
    <li className={`min-w-0 space-y-2 rounded border p-3 text-xs ${tone}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">{spec.label}</p>
          <p className="font-mono text-[10px] text-zinc-500">
            crossOrigin={spec.crossOrigin ? `"${spec.crossOrigin}"` : '(없음)'} · {CORS_LABEL[spec.cors]}
          </p>
        </div>
        <button type="button" disabled={disabled} onClick={onRun} className={BUTTON}>
          {running ? '실행 중…' : '실행'}
        </button>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">기대: {spec.expectLoaded ? 'onLoad' : 'onError(차단)'} — {spec.why}</p>
      {result ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[11px]">
          <dt className="text-zinc-500">콜백</dt>
          <dd>{result.outcome === 'timeout' ? '시간 초과' : result.outcome === 'load' ? 'onLoad' : 'onError'} ({result.durationMs}ms)</dd>
          <dt className="text-zinc-500">DOM 속성</dt>
          <dd>crossorigin={result.attr ?? '없음'} / .crossOrigin={String(result.prop)}</dd>
          <dt className="text-zinc-500">서버가 받은 요청</dt>
          <dd className="break-all">{result.echo ? `Sec-Fetch-Mode=${result.echo.secFetchMode ?? '없음'}, Origin=${result.echo.origin ?? '없음'}` : '스크립트 미실행'}</dd>
          <dt className="text-zinc-500">window error</dt>
          <dd className="break-all">
            {result.errorMessage ?? '없음'}
            {result.errorMessage ? ` (${isMasked(result.errorMessage) ? '가려짐' : '상세'})` : ''}
          </dd>
        </dl>
      ) : (
        <p className="text-zinc-500">아직 실행하지 않았습니다.</p>
      )}
      {mismatches.length > 0 && <p className="text-rose-700 dark:text-rose-300">{mismatches.join(' ')}</p>}
    </li>
  )
}
