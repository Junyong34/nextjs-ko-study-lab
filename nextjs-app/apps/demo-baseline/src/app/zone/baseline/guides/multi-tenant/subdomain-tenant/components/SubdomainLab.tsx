'use client'
import React from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useScenarios } from '../hooks/useScenarios'
import { judgeAll } from '../lib/judge'
import { ScenarioTable } from './ScenarioTable'
import { VerificationFooter } from './VerificationFooter'

export function SubdomainLab({ hostPanel }: { hostPanel: React.ReactNode }) {
  const { results, pending, run, runAll, reset } = useScenarios()
  const verdicts = judgeAll(results)

  return (
    <>
      <DemoPlaygroundCard title="actions.ts → api/tenant/route.ts — Host 헤더의 첫 라벨로 테넌트 해석">
        <div className="space-y-4">
          {hostPanel}
          <ScenarioTable results={results} pending={pending} onRun={run} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runAll}
              disabled={pending}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {pending ? '요청 중...' : '전체 실행'}
            </button>
            <DemoResetButton onReset={reset} label="측정 초기화" disabled={Object.keys(results).length === 0} />
            <span className="text-[11px] text-zinc-500">각 시나리오는 Server Action 이 Route Handler 를 실제 HTTP 로 호출합니다.</span>
          </div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter verdicts={verdicts} />
    </>
  )
}
