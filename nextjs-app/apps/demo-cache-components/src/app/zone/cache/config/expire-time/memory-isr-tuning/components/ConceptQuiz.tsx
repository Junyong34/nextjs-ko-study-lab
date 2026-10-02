'use client'
import React, { useId } from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { content } from '../content'
import type { QuizState } from '../hooks/useQuiz'

export function ConceptQuiz({ quiz }: { quiz: QuizState }) {
  const groupId = useId()
  return (
    <section className="space-y-3" aria-label="개념 확인">
      <h3 className="font-semibold">개념 확인</h3>
      {content.questions.map((question, index) => (
        <fieldset key={question.prompt} className="min-w-0 space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
          <legend className="px-1 text-xs font-medium">
            {index + 1}. {question.prompt}
          </legend>
          {question.choices.map((choice, choiceIndex) => (
            <label key={choice} className="flex cursor-pointer items-start gap-2 text-xs">
              <input
                type="radio"
                name={`${groupId}-question-${index}`}
                checked={quiz.answers[index] === choiceIndex}
                onChange={() => quiz.select(index, choiceIndex)}
                className="mt-0.5 shrink-0"
              />
              <span className="min-w-0 break-words">{choice}</span>
            </label>
          ))}
        </fieldset>
      ))}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!quiz.complete}
          onClick={quiz.submit}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          답안 확인
        </button>
        <DemoResetButton label="답안 초기화" onReset={quiz.reset} />
      </div>
    </section>
  )
}

export function QuizResult({ quiz }: { quiz: QuizState }) {
  if (!quiz.submitted) return <span>답안을 모두 고르고 [답안 확인]을 누르세요.</span>
  return (
    <div className="space-y-2">
      <p>
        정답 {quiz.correctCount} / {content.questions.length}
      </p>
      {content.questions.map((question, index) => (
        <div key={question.prompt}>
          <p>
            {index + 1}. 선택: {question.choices[quiz.answers[index]!]}
          </p>
          <p>
            {quiz.answers[index] === question.correct ? '일치' : '다시 확인'}: {question.reason}
          </p>
        </div>
      ))}
    </div>
  )
}
