'use client'

import React from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useSdkEventLog } from '../hooks/useSdkEventLog'
import { CallbackTimeline } from './CallbackTimeline'
import { PaymentSdkCheckout } from './PaymentSdkCheckout'
import { SdkFailureScenario } from './SdkFailureScenario'
import { VerificationFooter } from './VerificationFooter'

/** 실습 화면(2단)과 검증(3단)이 같은 모듈 스코프 로그를 읽도록 묶는 조립 컴포넌트 */
export function PgSdkWorkspace() {
  const events = useSdkEventLog()

  return (
    <>
      <DemoPlaygroundCard title="외부 PG사 결제 SDK onLoad 이벤트 실습">
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="max-w-xl text-[11px] leading-relaxed text-zinc-500">
              시뮬레이션이 아닙니다. <code>next/script</code>가 이 데모의 <code>sdk</code> Route Handler에서 실제 JS를 받아 실행하고,
              그 스크립트가 <code>window.DemoPay</code>를 정의합니다. 로그는 새로고침 전까지(=next/script 캐시 수명) 누적됩니다.
            </p>
            <DemoResetButton label="처음부터 다시 (새로고침)" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PaymentSdkCheckout />
            <SdkFailureScenario />
          </div>
          <CallbackTimeline events={events} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter events={events} />
    </>
  )
}
