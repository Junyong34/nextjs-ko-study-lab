'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useScriptLoadTimeline } from '../hooks/useScriptLoadTimeline'
import { ScriptLoadingStrategiesDemo } from './ScriptLoadingStrategiesDemo'
import { VerificationFooter } from './VerificationFooter'

/**
 * useScriptLoadTimeline을 한 번만 호출해 실습화면(2단)과 검증(3단)이
 * 동일한 실측 로드 이벤트·하이드레이션 시각을 공유하도록 묶는 클라이언트 조립 컴포넌트.
 */
export function ScriptTimingWorkspace() {
  const { hydratedAt, events, workerTimedOut } = useScriptLoadTimeline()

  return (
    <>
      <DemoPlaygroundCard title="next/script 로딩 전략 상세 비교 실습">
        <ScriptLoadingStrategiesDemo hydratedAt={hydratedAt} events={events} workerTimedOut={workerTimedOut} />
      </DemoPlaygroundCard>
      <VerificationFooter hydratedAt={hydratedAt} events={events} workerTimedOut={workerTimedOut} />
    </>
  )
}
