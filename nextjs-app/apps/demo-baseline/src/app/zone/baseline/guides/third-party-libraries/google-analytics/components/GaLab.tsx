'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useGaLab } from '../hooks/useGaLab'
import { GaPlayground } from './GaPlayground'
import { VerificationFooter } from './VerificationFooter'

// 실습 화면과 검증 패널이 같은 실측 상태(DOM·dataLayer·performance)를 공유하도록 훅을 한 곳에서 호출한다.
export function GaLab() {
  const lab = useGaLab()
  return (
    <>
      <DemoPlaygroundCard title="GoogleAnalytics 렌더와 sendGAEvent 실측 / google-analytics/components/GaPlayground.tsx">
        <GaPlayground lab={lab} />
      </DemoPlaygroundCard>
      <VerificationFooter lab={lab} />
    </>
  )
}
