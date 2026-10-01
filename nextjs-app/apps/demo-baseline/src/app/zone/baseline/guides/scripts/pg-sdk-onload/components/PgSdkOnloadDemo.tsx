'use client'

import React, { useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useScriptTrial } from '../hooks/useScriptTrial'
import { judge } from '../lib/judge'
import { SDK_ROUTE, type BootTiming } from '../types'
import { StrategyTiming } from './StrategyTiming'
import { TrialPanel } from './TrialPanel'
import { TrialScripts } from './TrialScripts'
import { VerificationFooter } from './VerificationFooter'

export function PgSdkOnloadDemo() {
  const [boot, setBoot] = useState<BootTiming | null>(null)
  const trial = useScriptTrial()
  const { matched, actual } = judge(boot, trial.trials, trial.payAttempts)

  return (
    <>
      <DemoPlaygroundCard title="PG SDK 로드 strategy · 콜백 시점 · 호출 가드 (guides/scripts/pg-sdk-onload)">
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="max-w-xl text-[11px] leading-relaxed text-zinc-500">
              시뮬레이션이 아닙니다. <code>next/script</code>가 이 데모의 Route Handler(<code>{SDK_ROUTE}</code>)에서 실제 JS를 받아
              실행합니다. 모든 시각은 <code>performance.now()</code>와 Resource Timing으로 읽고, 전역 객체 존재 여부는 콜백 안에서
              <code>typeof window.PgSdk</code>로 확인합니다.
            </p>
            <DemoResetButton label="처음부터 다시 (새로고침)" />
          </div>
          <StrategyTiming timing={boot} onTiming={setBoot} />
          <TrialPanel
            active={trial.active}
            trials={trial.trials}
            sdkLoaded={trial.sdkLoaded}
            payAttempts={trial.payAttempts}
            onStart={trial.start}
            onPay={trial.pay}
          />
          {trial.active && (
            <TrialScripts
              key={trial.active.runId}
              trial={trial.active}
              sdkLoaded={trial.sdkLoaded}
              onEvent={trial.record}
              onSdkLoad={trial.onSdkLoad}
              onPluginLoad={trial.onPluginLoad}
            />
          )}
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter matched={matched} actual={actual} />
    </>
  )
}
