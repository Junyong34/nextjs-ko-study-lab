'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { content } from '../content'
import type { ConceptQuizState } from '../hooks/useConceptQuiz'
import type { Verdict } from '../types'

interface Props {
  scanVerdict: Verdict
  trialVerdict: Verdict
  quiz: ConceptQuizState
}

function Reasons({ verdict }: { verdict: Verdict }) {
  return (
    <ul className="list-disc space-y-1 pl-4">
      {verdict.reasons.map((reason) => <li key={reason}>{reason}</li>)}
    </ul>
  )
}

export function VerificationPanels({ scanVerdict, trialVerdict, quiz }: Props) {
  return (
    <div className="space-y-3" aria-live="polite">
      <ExpectedActualPanel
        title="1. 현재 설정: Next 생성 자산 태그의 crossorigin"
        className="min-w-0 break-words"
        expected={<span>이 앱은 crossOrigin을 설정하지 않았으므로 부트스트랩 defer 스크립트·CSS link에 crossorigin 속성이 0개입니다. Flight 청크(async)는 판정하지 않고 값만 보여 줍니다.</span>}
        actual={<Reasons verdict={scanVerdict} />}
        isMatched={scanVerdict.isMatched}
        description="실제 값은 이 문서의 DOM에서 읽은 태그입니다. 설정을 켠 상태의 결과는 측정하지 않았습니다."
      />
      <ExpectedActualPanel
        title="2. 속성의 의미: <Script crossOrigin> 다섯 조합"
        className="min-w-0 break-words"
        expected={
          <span>
            속성 없음은 실행되지만 오류가 &quot;Script error.&quot;로 가려지고, anonymous는 서버 허용이 있을 때만 상세 오류와 함께 실행되며,
            use-credentials는 * 허용으로는 차단됩니다.
          </span>
        }
        actual={<Reasons verdict={trialVerdict} />}
        isMatched={trialVerdict.isMatched}
        description="실제 값은 <Script>의 onLoad/onError 호출, DOM 속성, Route Handler가 받은 요청 헤더, window error 이벤트에서 측정합니다."
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
  )
}
