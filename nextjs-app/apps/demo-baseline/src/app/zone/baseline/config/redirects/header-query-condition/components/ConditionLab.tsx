'use client'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useConditionProbe } from '../hooks/useConditionProbe'
import { RequestForm } from './RequestForm'
import { ResultLog } from './ResultLog'
import { VerificationFooter } from './VerificationFooter'

export function ConditionLab() {
  const p = useConditionProbe()
  return (
    <>
      <DemoPlaygroundCard title="redirects() 조건부 리다이렉트 요청 실험실 — next.config.ts / redirects-condition.ts">
        <div className="space-y-4">
          <RequestForm
            input={p.input}
            isPending={p.isPending}
            onUpdate={p.update}
            onSelectRule={p.selectRule}
            onPreset={p.preset}
            onSend={p.send}
            onReset={p.reset}
          />
          <ResultLog history={p.history} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter history={p.history} />
    </>
  )
}
