'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useBeaconLab } from '../hooks/useBeaconLab'
import { AnalyticsBeaconDemo } from './AnalyticsBeaconDemo'
import { VerificationFooter } from './VerificationFooter'

// 실습 화면과 검증 패널이 같은 실측 상태(서버 수신 목록)를 공유하도록 훅을 한 곳에서 호출한다.
export function BeaconLab() {
  const lab = useBeaconLab()
  return (
    <>
      <DemoPlaygroundCard title="상품 클릭 커스텀 이벤트 비콘 전송 실습">
        <AnalyticsBeaconDemo lab={lab} />
      </DemoPlaygroundCard>
      <VerificationFooter attempt={lab.attempt} phase={lab.phase} serverGotIt={lab.serverGotIt} />
    </>
  )
}
