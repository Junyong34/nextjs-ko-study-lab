'use client'

import React, { useId, useState } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { FORMAT_CASES } from '../lib/constants'
import { negotiate } from '../lib/negotiate'
import type { ImageFormat } from '../types'

type Answer = ImageFormat | 'original'
const CHOICES: { value: Answer; label: string }[] = [
  { value: 'image/avif', label: 'image/avif' },
  { value: 'image/webp', label: 'image/webp' },
  { value: 'original', label: '원본 포맷 유지' },
]
const labelOf = (a: Answer) => CHOICES.find((c) => c.value === a)?.label ?? a

export function FormatQuiz() {
  const groupId = useId()
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [submitted, setSubmitted] = useState(false)
  const complete = FORMAT_CASES.every((c) => answers[c.id] !== undefined)
  // 정답은 미리 적어 두지 않고 협상 계산(lib/negotiate.ts)으로 구한다.
  const results = FORMAT_CASES.map((c) => ({ ...c, answer: (negotiate(c.formats, c.accept) ?? 'original') as Answer }))
  const correct = results.filter((r) => answers[r.id] === r.answer).length

  function reset() {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section className="min-w-0 space-y-3" aria-label="개념 확인">
      <h3 className="text-sm font-semibold">개념 확인 — optimizer는 어떤 포맷으로 응답할까?</h3>
      <ul className="space-y-2">
        {results.map((r, index) => (
          <li key={r.id} className="min-w-0 space-y-1.5 rounded border border-zinc-200 p-2.5 text-xs dark:border-zinc-800">
            <p className="font-medium">{index + 1}. {r.label}</p>
            <p className="break-all font-mono text-zinc-600 dark:text-zinc-400">Accept: {r.accept}</p>
            <p className="break-all font-mono text-zinc-600 dark:text-zinc-400">formats: [{r.formats.map((f) => `'${f}'`).join(', ')}]</p>
            <div className="flex flex-wrap gap-3">
              {CHOICES.map((c) => (
                <label key={c.value} className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="radio"
                    name={`${groupId}-${r.id}`}
                    checked={answers[r.id] === c.value}
                    onChange={() => { setAnswers((prev) => ({ ...prev, [r.id]: c.value })); setSubmitted(false) }}
                  />
                  {c.label}
                </label>
              ))}
            </div>
            {submitted && (
              <p className={answers[r.id] === r.answer ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                {answers[r.id] === r.answer ? '정답' : '오답'} — 계산 결과 {labelOf(r.answer)}
              </p>
            )}
          </li>
        ))}
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
          {submitted ? `정답 ${correct} / ${FORMAT_CASES.length}` : complete ? '[답안 확인]을 누르세요.' : `${FORMAT_CASES.length}문항에 모두 답하세요.`}
        </span>
      </div>
      <p className="text-xs text-zinc-500">
        정답은 next@16.3.2 image-optimizer의 포맷 결정 규칙을 옮긴 계산(lib/negotiate.ts)입니다. 이 앱의 optimizer가 실제로 변환한 결과가 아닙니다. 3번 문항은 개념 정리의 &quot;배열 순서&quot; 항목과 함께 읽어 보세요.
      </p>
    </section>
  )
}
