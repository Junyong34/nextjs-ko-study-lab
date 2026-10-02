'use client'
import React from 'react'
import { DemoPlaygroundCard, ExpectedActualPanel } from '@study/demo-kit'
import { useHeaderProbe } from '../hooks/useHeaderProbe'
import { useQuiz } from '../hooks/useQuiz'
import { judgeTarget, overallMatched } from '../lib/judge'
import { TARGETS } from '../types'
import { content } from '../content'
import { HeaderProbeConsole } from './HeaderProbeConsole'
import { ExplainSection } from './ExplainSection'
import { ConceptQuiz, QuizResult } from './ConceptQuiz'

export function ConfigExpireTimeDemo({ nodeEnv }: { nodeEnv: string }) {
  const probe = useHeaderProbe()
  const quiz = useQuiz()
  const measured = Object.keys(probe.readings).length > 0
  const results = TARGETS.map((target) => ({ target, ...judgeTarget(target, probe.readings[target.key], nodeEnv) }))
  const matched = measured ? overallMatched(results.map((r) => r.verdict)) : undefined

  return (
    <>
      <DemoPlaygroundCard title="expireTime 기본값 실측과 설정 예제" className="min-w-0">
        <div className="min-w-0 space-y-5 text-sm leading-relaxed">
          <HeaderProbeConsole probe={probe} nodeEnv={nodeEnv} />
          <ExplainSection />
          <ConceptQuiz quiz={quiz} />
        </div>
      </DemoPlaygroundCard>
      <div aria-live="polite" className="space-y-4">
        <ExpectedActualPanel
          title="기본 expireTime이 반영된 Cache-Control"
          className="min-w-0 break-words"
          expected={
            nodeEnv === 'production' ? (
              <span>default 프로필은 s-maxage=900, stale-while-revalidate=31535100, hours 프로필은 s-maxage=3600, stale-while-revalidate=82800, 동적 경로는 s-maxage 없음</span>
            ) : (
              <span>NODE_ENV={nodeEnv}: next dev는 Cache-Control: no-cache, must-revalidate를 보내므로 expireTime을 판정할 수 없습니다.</span>
            )
          }
          actual={
            measured ? (
              <div className="space-y-1">
                {results.map(({ target, verdict, reason }) => (
                  <p key={target.key} className="break-all">
                    {target.key}: {probe.readings[target.key]?.cacheControl ?? '(없음)'} — {verdict === 'match' ? '일치' : verdict === 'mismatch' ? '불일치' : '판정 불가'}. {reason}
                  </p>
                ))}
              </div>
            ) : (
              <span>[헤더 측정]을 누르면 세 대상 라우트의 실제 응답 헤더가 표시됩니다.</span>
            )
          }
          isMatched={matched}
          description="브라우저가 받은 실제 응답 헤더만으로 판정합니다. dev 서버나 CDN을 거친 응답은 판정 불가로 표시합니다."
        />
        <ExpectedActualPanel
          title="선택한 답안의 개념 확인"
          className="min-w-0 break-words"
          expected={<span>{content.questions.length}문항 모두 공식 문서의 동작과 맞는 답을 선택합니다.</span>}
          actual={<QuizResult quiz={quiz} />}
          isMatched={quiz.submitted ? quiz.correctCount === content.questions.length : undefined}
          description="사용자가 선택한 답안을 판정합니다. expireTime을 바꾼 결과는 별도 앱의 확인 절차로 확인하세요."
        />
      </div>
    </>
  )
}
