'use client'
import React from 'react'
import { DemoPlaygroundCard, ExpectedActualPanel } from '@study/demo-kit'
import { useHandlerProbe } from '../hooks/useHandlerProbe'
import { useQuiz } from '../hooks/useQuiz'
import { content } from '../content'
import { ProbeConsole } from './ProbeConsole'
import { ExplainSection } from './ExplainSection'
import { ConceptQuiz, QuizResult } from './ConceptQuiz'

function ProbeSummary({ probe }: { probe: ReturnType<typeof useHandlerProbe> }) {
  const reads = probe.records.filter((r) => r.kind === 'read')
  if (probe.records.length === 0) return <span>측정 대기 중입니다. [캐시 읽기] 2회 → [캐시 무효화] → [캐시 읽기] 2회 순서로 누르세요.</span>
  const pids = [...new Set(probe.records.map((r) => r.instance.pid))]
  const ids = [...new Set(reads.map((r) => r.snapshot.cacheId))]
  return (
    <div className="space-y-1">
      <p>
        읽기 {reads.length}회 · 무효화 {probe.records.length - reads.length}회 · 받은 cacheId {ids.join(' → ') || '없음'}
      </p>
      <p>응답한 PID: {pids.join(', ')}</p>
      <p>
        {probe.matched === true
          ? '같은 프로세스 메모리에서 재사용되다가 무효화 직후에만 다시 계산되었습니다.'
          : probe.matched === false
            ? '무효화하지 않았는데 cacheId가 바뀌었거나 다른 PID가 응답했습니다. 서버 재시작·파일 수정(HMR)·다른 인스턴스를 의심하세요.'
            : '아직 기대 순서(재사용 → 무효화 → 다시 계산 → 재사용)를 다 보지 못했습니다.'}
      </p>
    </div>
  )
}

export function ConfigCacheHandlersDemo() {
  const probe = useHandlerProbe()
  const quiz = useQuiz()

  return (
    <>
      <DemoPlaygroundCard title="기본 캐시 핸들러 실측과 cacheHandlers 설정 예제" className="min-w-0">
        <div className="min-w-0 space-y-5 text-sm leading-relaxed">
          <ProbeConsole probe={probe} />
          <ExplainSection />
          <ConceptQuiz quiz={quiz} />
        </div>
      </DemoPlaygroundCard>
      <div aria-live="polite" className="space-y-4">
        <ExpectedActualPanel
          title="기본 핸들러(메모리 LRU) 실측"
          className="min-w-0 break-words"
          expected={
            <span>
              같은 PID에서 연속 읽기는 같은 cacheId를 받고(재사용), [캐시 무효화] 직후 첫 읽기만 새 cacheId를 받은 뒤 다시 재사용됩니다.
            </span>
          }
          actual={<ProbeSummary probe={probe} />}
          isMatched={probe.matched}
          description="probe Route Handler가 돌려준 cacheId·계산 시각·PID로 판정합니다. 여러 인스턴스 사이의 공유 여부는 이 앱에서 측정하지 않습니다."
        />
        <ExpectedActualPanel
          title="선택한 답안의 개념 확인"
          className="min-w-0 break-words"
          expected={<span>{content.questions.length}문항 모두 공식 문서의 동작과 맞는 답을 선택합니다.</span>}
          actual={<QuizResult quiz={quiz} />}
          isMatched={quiz.submitted ? quiz.correctCount === content.questions.length : undefined}
          description="사용자가 선택한 답안을 판정합니다. 실제 핸들러 교체 결과는 별도 앱의 확인 절차로 확인하세요."
        />
      </div>
    </>
  )
}
