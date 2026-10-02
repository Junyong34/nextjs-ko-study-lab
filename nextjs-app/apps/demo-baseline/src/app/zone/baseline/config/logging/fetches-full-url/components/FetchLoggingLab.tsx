'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import type { FetchRun } from '../types'
import { useFetchRuns } from '../hooks/useFetchRuns'
import { content } from '../content'
import { FetchRunPanel } from './FetchRunPanel'
import { ConfigExamples } from './ConfigExamples'
import { ConceptQuiz } from './ConceptQuiz'
import { VerificationFooter } from './VerificationFooter'

export function FetchLoggingLab({ latest }: { latest: FetchRun }) {
  const { runs, isPending, rerun, reset } = useFetchRuns(latest)
  const [answers, setAnswers] = useState<(number | null)[]>(content.questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)

  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="logging.fetches.fullUrl과 서버 fetch 터미널 로그"
        concept="logging.fetches를 켜면 dev 서버가 서버 컴포넌트의 fetch를 요청 줄 아래에 출력하고, fullUrl: true면 긴 URL을 자르지 않습니다. 이 앱은 설정을 켜지 않았으므로 실제 fetch는 측정하고 터미널 표시는 설명으로 비교합니다."
        className="min-w-0 break-words"
        steps={[
          { step: 1, title: '[서버 렌더 다시 실행] 누르기', description: 'page.tsx가 서버에서 다시 실행되며 긴 쿼리스트링이 붙은 fetch를 api/catalog로 보냅니다.', observe: '요청 URL 길이, 받은 쿼리, 요청 번호 증가', observeAt: 'playground' },
          { step: 2, title: '세 가지 설정의 터미널 표시 비교', description: '설정 없음, fetches: {}, fullUrl: true일 때 같은 fetch가 어떻게 찍히는지 규칙으로 계산한 결과를 읽습니다.', observe: '잘린 URL과 전체 URL의 차이', observeAt: 'playground' },
          { step: 3, title: '[개념 확인]에서 [답안 확인]', description: '오답도 골라 보고 [답안 초기화]로 다시 풉니다. 별도 앱에서는 설정 예제대로 터미널을 직접 확인하세요.', observe: '측정 항목과 정답 판정', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="서버 fetch 실측과 로그 설정 비교" className="min-w-0">
        <div className="min-w-0 space-y-5 text-sm leading-relaxed">
          <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/30">
            이 앱에서는 적용하지 않았습니다 — {content.notApplied}
          </p>
          <FetchRunPanel runs={runs} isPending={isPending} onRerun={rerun} onReset={reset} />
          <ConfigExamples />
          <ConceptQuiz
            answers={answers}
            onSelect={(index, choice) => {
              setAnswers((prev) => prev.map((answer, i) => (i === index ? choice : answer)))
              setSubmitted(false)
            }}
            onSubmit={() => setSubmitted(true)}
            onReset={() => {
              setAnswers(content.questions.map(() => null))
              setSubmitted(false)
            }}
          />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter runs={runs} answers={answers} submitted={submitted} />
    </DemoContainer>
  )
}
