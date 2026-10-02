'use client'

import React, { useId, useState } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { PATTERN_SETS, URL_CASES, judgeUrl } from '../lib/remote-pattern'
import type { PatternSetId, Verdict } from '../types'

const VERDICT_LABEL: Record<Verdict, string> = { allow: '허용', block: '400 거절' }

export function PatternQuiz() {
  const groupId = useId()
  const [setId, setSetId] = useState<PatternSetId>('strict')
  const [answers, setAnswers] = useState<Record<string, Verdict>>({})
  const [submitted, setSubmitted] = useState(false)
  const set = PATTERN_SETS.find((s) => s.id === setId) ?? PATTERN_SETS[0]
  const complete = URL_CASES.every((c) => answers[c.id] !== undefined)
  // 정답은 제출 시점에 문서 규칙 판정 함수로 계산한다(미리 적어 둔 정답표가 없다).
  const results = URL_CASES.map((c) => ({ ...c, result: judgeUrl(set, c.url) }))
  const correct = results.filter((r) => answers[r.id] === r.result.verdict).length

  function reset() {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section className="min-w-0 space-y-3" aria-label="개념 확인">
      <h3 className="text-sm font-semibold">개념 확인 — 이 URL은 패턴을 통과할까?</h3>
      <div className="flex flex-wrap gap-1.5">
        {PATTERN_SETS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={s.id === setId}
            onClick={() => { setSetId(s.id); reset() }}
            className={`rounded px-2.5 py-1 text-xs font-medium ${s.id === setId ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-100"><code>{set.code}</code></pre>
      <ul className="space-y-2">
        {results.map((r, index) => {
          const answer = answers[r.id]
          const isRight = answer === r.result.verdict
          return (
            <li key={r.id} className="min-w-0 space-y-1.5 rounded border border-zinc-200 p-2.5 text-xs dark:border-zinc-800">
              <p className="break-all font-mono">{index + 1}. {r.url}</p>
              <div className="flex flex-wrap gap-3">
                {(['allow', 'block'] as const).map((v) => (
                  <label key={v} className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="radio"
                      name={`${groupId}-${r.id}`}
                      checked={answer === v}
                      onChange={() => { setAnswers((prev) => ({ ...prev, [r.id]: v })); setSubmitted(false) }}
                    />
                    {VERDICT_LABEL[v]}
                  </label>
                ))}
              </div>
              {submitted && (
                <div className={isRight ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                  <p>{isRight ? '정답' : '오답'} — 계산 결과 {VERDICT_LABEL[r.result.verdict]}: {r.result.reason}</p>
                  {r.note && <p className="text-zinc-600 dark:text-zinc-400">{r.note}</p>}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!complete}
          onClick={() => setSubmitted(true)}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          답안 확인
        </button>
        <DemoResetButton label="답안 초기화" onReset={reset} />
        <span aria-live="polite" className="text-xs text-zinc-600 dark:text-zinc-400">
          {submitted ? `정답 ${correct} / ${URL_CASES.length}` : complete ? '[답안 확인]을 누르세요.' : `${URL_CASES.length}개 URL에 모두 답하세요.`}
        </span>
      </div>
      <p className="text-xs text-zinc-500">
        정답은 공식 문서의 remotePatterns 규칙을 옮긴 판정 함수(lib/remote-pattern.ts)의 계산입니다. 이 앱의 optimizer가 실제로 거절한 결과가 아닙니다.
      </p>
    </section>
  )
}
