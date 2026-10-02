'use client'

import React, { useId, useState } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { content } from '../content'

/** 켜야만 보이는 동작(export 빌드의 .txt 요청, 산출물)은 실측 대신 개념 확인으로 다룬다. 판정은 학습자 답안만 대상으로 한다. */
export function ConceptQuiz() {
  const groupId = useId()
  const [answers, setAnswers] = useState<(number | null)[]>(content.questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const complete = answers.every((answer) => answer !== null)
  const correctCount = content.questions.filter((q, i) => answers[i] === q.correct).length

  function select(index: number, choice: number) {
    setAnswers((prev) => prev.map((answer, i) => (i === index ? choice : answer)))
    setSubmitted(false)
  }

  return (
    <section className="space-y-3" aria-label="개념 확인">
      <h4 className="text-xs font-semibold">개념 확인</h4>
      {content.questions.map((question, index) => (
        <fieldset key={question.prompt} className="min-w-0 space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
          <legend className="px-1 text-xs font-medium">{index + 1}. {question.prompt}</legend>
          {question.choices.map((choice, choiceIndex) => (
            <label key={choice} className="flex cursor-pointer items-start gap-2 text-xs">
              <input
                type="radio"
                name={`${groupId}-q${index}`}
                checked={answers[index] === choiceIndex}
                onChange={() => select(index, choiceIndex)}
                className="mt-0.5 shrink-0"
              />
              <span className="min-w-0 break-words">{choice}</span>
            </label>
          ))}
          {submitted && (
            <p className={`text-xs ${answers[index] === question.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
              {answers[index] === question.correct ? '정답' : '오답'} — {question.reason}
            </p>
          )}
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!complete}
          onClick={() => setSubmitted(true)}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          답안 확인
        </button>
        <DemoResetButton
          label="답안 초기화"
          onReset={() => {
            setAnswers(content.questions.map(() => null))
            setSubmitted(false)
          }}
        />
        <span aria-live="polite" className="text-xs text-zinc-600 dark:text-zinc-400">
          {submitted ? `정답 ${correctCount} / ${content.questions.length}` : complete ? '[답안 확인]을 누르세요.' : '모든 문항을 고르면 답안을 확인할 수 있습니다.'}
        </span>
      </div>
    </section>
  )
}
