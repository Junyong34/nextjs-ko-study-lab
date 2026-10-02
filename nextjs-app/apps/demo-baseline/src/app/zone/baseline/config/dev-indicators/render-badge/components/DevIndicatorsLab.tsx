'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { useIndicatorProbe } from '../hooks/useIndicatorProbe'
import { content } from '../content'
import { IndicatorProbePanel } from './IndicatorProbePanel'
import { ConfigExamples } from './ConfigExamples'
import { ConceptQuiz } from './ConceptQuiz'
import { VerificationFooter } from './VerificationFooter'

export function DevIndicatorsLab() {
  const { probes, measure, reset } = useIndicatorProbe()
  const [answers, setAnswers] = useState<(number | null)[]>(content.questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)

  return (
    <DemoContainer className="min-w-0 space-y-4 [&_fieldset]:min-w-0 [&_legend]:max-w-full [&_legend]:break-words">
      <DemoGuideCard
        title="devIndicators로 개발 표시기 위치·숨김 제어"
        concept="next dev에서만 화면 모서리에 뜨는 Next.js 표시기는 devIndicators의 position으로 옮기거나 false로 숨깁니다. 이 앱은 기본값 그대로이므로 지금 화면의 표시기 DOM을 측정하고, 설정 변경은 예제와 절차로 확인합니다."
        className="min-w-0 break-words"
        steps={[
          { step: 1, title: '[표시기 측정] 누르기', description: '<nextjs-portal>과 그 shadow root 안의 표시기 위치를 읽습니다.', observe: 'nextjs-portal 수, 표시기 좌표와 사분면', observeAt: 'playground' },
          { step: 2, title: '표시기를 눌러 메뉴를 연 뒤 다시 측정', description: 'Dev Tools 메뉴의 Route 항목(Static/Dynamic) 값을 함께 읽습니다. 판정에는 넣지 않습니다.', observe: 'Route 값', observeAt: 'playground' },
          { step: 3, title: '[개념 확인]에서 [답안 확인]', description: '오답도 골라 보고 [답안 초기화]로 다시 풉니다.', observe: '측정 항목과 정답 판정', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="개발 표시기 측정과 설정 비교" className="min-w-0">
        <div className="min-w-0 space-y-5 text-sm leading-relaxed">
          <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/30">
            이 앱에서는 적용하지 않았습니다 — {content.notApplied}
          </p>
          <IndicatorProbePanel probes={probes} onMeasure={measure} onReset={reset} />
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
      <VerificationFooter probes={probes} answers={answers} submitted={submitted} />
    </DemoContainer>
  )
}
