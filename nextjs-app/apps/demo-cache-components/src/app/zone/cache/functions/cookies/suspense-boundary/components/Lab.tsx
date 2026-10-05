'use client'

import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useStreamProbe } from '../hooks/useStreamProbe'
import { ProbePanel } from './ProbePanel'
import { Verification } from './Verification'
import { ConceptCard } from './ConceptCard'

/** 훅 상태를 실습 화면과 검증 패널이 함께 쓰도록 묶는다. */
export function Lab() {
  const { runs, running, cookieSent, error, probe, issueCookie, removeCookie, reset } = useStreamProbe()
  return (
    <>
      <DemoPlaygroundCard title="같은 cookies() 읽기, 다른 Suspense 위치 — 응답 HTML 직접 측정">
        <div className="space-y-3">
          <div className="flex justify-end">
            <DemoResetButton label="측정·쿠키 초기화" onReset={reset} />
          </div>
          <ProbePanel
            runs={runs}
            running={running}
            cookieSent={cookieSent}
            error={error}
            onProbe={probe}
            onIssue={issueCookie}
            onRemove={removeCookie}
          />
        </div>
      </DemoPlaygroundCard>
      <Verification runs={runs} />
      <ConceptCard />
    </>
  )
}
