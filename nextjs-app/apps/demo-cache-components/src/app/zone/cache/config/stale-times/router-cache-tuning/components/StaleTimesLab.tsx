'use client'

import React, { useId } from 'react'
import { DemoPlaygroundCard, DemoResetButton, ExpectedActualPanel } from '@study/demo-kit'
import { ConfigGuide } from './ConfigGuide'
import { useStaleTimesLab } from './StaleTimesProvider'
import { content } from '../content'
import { useConceptQuiz } from '../hooks/useConceptQuiz'
import { judgeDynamic, judgeStatic } from '../lib/judge'
import { DEFAULT_STALE_TIMES, type Verdict } from '../types'

function Reasons({ verdict }: { verdict: Verdict }) {
  return (
    <ul className="list-disc space-y-1 pl-4">
      {verdict.reasons.map((reason) => <li key={reason}>{reason}</li>)}
    </ul>
  )
}

/** 설정 예제·개념 확인과 세 검증 패널. 패널의 실제 값은 측정기의 이동 기록과 사용자가 고른 답안이다. */
export function StaleTimesLab() {
  const groupId = useId()
  const { records } = useStaleTimesLab()
  const quiz = useConceptQuiz(content.questions)
  const dynamicVerdict = judgeDynamic(records)
  const staticVerdict = judgeStatic(records)

  return (
    <>
      <DemoPlaygroundCard title="값을 바꾼 결과: 설정 예제와 개념 확인" className="min-w-0">
        <div className="min-w-0 space-y-5 text-sm leading-relaxed">
          <ConfigGuide />
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
        </div>
      </DemoPlaygroundCard>
      <div className="space-y-3" aria-live="polite">
        <ExpectedActualPanel
          title={`1. 동적 page 재방문 (staleTimes.dynamic 기본 ${DEFAULT_STALE_TIMES.dynamic}초)`}
          className="min-w-0 break-words"
          expected={<span>재방문마다 이동 중 RSC 요청이 1건 이상 나가고 렌더 ID가 새로 바뀝니다.</span>}
          actual={<Reasons verdict={dynamicVerdict} />}
          isMatched={dynamicVerdict.isMatched}
          description="실제 값은 window.fetch 계측으로 센 RSC 요청 수와 도착 page가 보고한 렌더 ID입니다."
        />
        <ExpectedActualPanel
          title={`2. 정적 page 재방문 (staleTimes.static 기본 ${DEFAULT_STALE_TIMES.static}초)`}
          className="min-w-0 break-words"
          expected={<span>production에서 stale 시간 안의 재방문은 이동 중 일반 RSC 요청이 0건입니다. dev에서는 판정하지 않습니다.</span>}
          actual={<Reasons verdict={staticVerdict} />}
          isMatched={staticVerdict.isMatched}
          description="dev 서버는 prefetch와 클라이언트 재사용이 production과 달라 관찰값만 표시합니다."
        />
        <ExpectedActualPanel
          title="3. 개념 확인 답안"
          className="min-w-0 break-words"
          expected={<span>세 문항 모두 위 실측과 공식 문서의 동작에 맞는 답을 선택합니다.</span>}
          actual={
            quiz.submitted ? (
              <div className="space-y-2">
                <p>정답 {quiz.correctCount} / {content.questions.length}</p>
                {content.questions.map((question, index) => (
                  <div key={question.prompt}>
                    <p>{index + 1}. 선택: {question.choices[quiz.answers[index]!]}</p>
                    <p>{quiz.answers[index] === question.correct ? '일치' : '다시 확인'}: {question.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <span>답안을 모두 고르고 [답안 확인]을 누르세요.</span>
            )
          }
          isMatched={quiz.submitted ? quiz.correctCount === content.questions.length : undefined}
          description="사용자가 고른 답안을 판정합니다."
        />
      </div>
    </>
  )
}
