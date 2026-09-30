'use client'

import React, { useId, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton, ExpectedActualPanel } from '@study/demo-kit'
import { content } from '../content'

export function ConfigOutputStandaloneDemo() {
  const groupId = useId()
  const [answers, setAnswers] = useState<(number | null)[]>(content.questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const complete = answers.every(answer => answer !== null)
  const correctCount = content.questions.filter((question, index) => answers[index] === question.correct).length

  function selectAnswer(index: number, choice: number) {
    setAnswers(previous => previous.map((answer, i) => i === index ? choice : answer))
    setSubmitted(false)
  }

  return (
    <>
      <DemoPlaygroundCard title="설정 예제와 개념 확인" className="min-w-0">
        <div className="min-w-0 space-y-5 text-sm leading-relaxed">
          <p className="rounded border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
            설명형 예제입니다. 아래 코드는 별도 앱에서 실행할 설정과 확인 절차입니다.
            이 화면은 전역 설정을 변경하거나 빌드·배포를 실행하지 않습니다.
          </p>
          <p>{content.scenario}</p>
          <section className="min-w-0 space-y-3" aria-label="설정 예제">
            <h3 className="font-semibold">설정 예제</h3>
            {content.examples.map(example => (
              <div key={example.file} className="min-w-0 space-y-2">
                <h4 className="break-all font-mono text-xs font-medium">{example.file}</h4>
                <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-100">
                  <code>{example.code}</code>
                </pre>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{example.note}</p>
              </div>
            ))}
          </section>
          <section className="space-y-2" aria-label="직접 확인할 증거">
            <h3 className="font-semibold">직접 확인할 증거</h3>
            <ol className="list-decimal space-y-2 pl-5 text-xs">
              {content.procedure.map(step => <li key={step}>{step}</li>)}
            </ol>
          </section>
          <section className="space-y-2" aria-label="주의점과 흔한 오용">
            <h3 className="font-semibold">주의점과 흔한 오용</h3>
            <ul className="list-disc space-y-2 pl-5 text-xs">
              {content.cautions.map(caution => <li key={caution}>{caution}</li>)}
            </ul>
          </section>
          <section className="space-y-3" aria-label="개념 확인">
            <h3 className="font-semibold">개념 확인</h3>
            {content.questions.map((question, index) => (
              <fieldset key={question.prompt} className="min-w-0 space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
                <legend className="px-1 text-xs font-medium">{index + 1}. {question.prompt}</legend>
                {question.choices.map((choice, choiceIndex) => (
                  <label key={choice} className="flex cursor-pointer items-start gap-2 text-xs">
                    <input
                      type="radio"
                      name={`${groupId}-question-${index}`}
                      checked={answers[index] === choiceIndex}
                      onChange={() => selectAnswer(index, choiceIndex)}
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
                disabled={!complete}
                onClick={() => setSubmitted(true)}
                className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
              >
                답안 확인
              </button>
              <DemoResetButton label="답안 초기화" onReset={() => {
                setAnswers(content.questions.map(() => null))
                setSubmitted(false)
              }} />
            </div>
          </section>
        </div>
      </DemoPlaygroundCard>
      <div aria-live="polite">
        <ExpectedActualPanel
          title="선택한 답안의 개념 확인"
          className="min-w-0 break-words"
          expected={<span>두 문항 모두 공식 문서의 동작과 맞는 답을 선택합니다.</span>}
          actual={submitted ? (
            <div className="space-y-2">
              <p>정답 {correctCount} / {content.questions.length}</p>
              {content.questions.map((question, index) => (
                <div key={question.prompt}>
                  <p>{index + 1}. 선택: {question.choices[answers[index]!]}</p>
                  <p>{answers[index] === question.correct ? '일치' : '다시 확인'}: {question.reason}</p>
                </div>
              ))}
            </div>
          ) : <span>답안을 모두 고르고 [답안 확인]을 누르세요.</span>}
          isMatched={submitted ? correctCount === content.questions.length : undefined}
          description="사용자가 선택한 답안을 판정합니다. 실제 설정 적용 여부는 위의 산출물과 요청 증거로 별도로 확인하세요."
        />
      </div>
    </>
  )
}
