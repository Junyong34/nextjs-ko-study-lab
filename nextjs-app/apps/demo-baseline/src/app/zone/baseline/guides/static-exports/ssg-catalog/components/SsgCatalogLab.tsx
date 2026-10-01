'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useCatalogProbe } from '../hooks/useCatalogProbe'
import { judge } from '../lib/judge'
import { ProbeConsole } from './ProbeConsole'
import { VerificationFooter } from './VerificationFooter'

export function SsgCatalogLab() {
  const s = useCatalogProbe()
  const judgement = judge(Object.values(s.runs))
  return (
    <>
      <DemoPlaygroundCard title="products/[id] 정적 카탈로그 응답 측정 실습">
        <ProbeConsole
          selectedId={s.selectedId}
          onSelect={s.setSelectedId}
          runs={s.runs}
          isRunning={s.isRunning}
          onRun={s.run}
          onReset={s.reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter judgement={judgement} />
    </>
  )
}
