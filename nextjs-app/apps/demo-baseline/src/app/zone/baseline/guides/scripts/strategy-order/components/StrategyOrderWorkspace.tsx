'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { evaluateChecks } from '../hooks/evaluateChecks'
import { useProbeStore } from '../hooks/useProbeStore'
import { DedupeLab } from './DedupeLab'
import { OrderLab } from './OrderLab'
import { RouteScopeTable } from './RouteScopeTable'
import { VerificationFooter } from './VerificationFooter'

/** 실습 화면(2단)과 검증(3단)이 같은 실측 스토어를 읽도록 묶는 조립 컴포넌트. */
export function StrategyOrderWorkspace() {
  const store = useProbeStore()
  const pathname = usePathname()

  return (
    <>
      <DemoPlaygroundCard title="여러 서드파티 스크립트 배치 실습">
        <div className="space-y-5 divide-y divide-zinc-200 dark:divide-zinc-800 [&>*:not(:first-child)]:pt-5">
          <OrderLab store={store} />
          <RouteScopeTable store={store} currentPath={pathname} />
          <DedupeLab store={store} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter checks={evaluateChecks(store)} />
    </>
  )
}
