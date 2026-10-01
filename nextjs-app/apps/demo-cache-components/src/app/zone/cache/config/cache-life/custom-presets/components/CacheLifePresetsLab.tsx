'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { usePresetProbe } from '../hooks/usePresetProbe'
import { PresetProbeConsole } from './PresetProbeConsole'
import { FaultConsole } from './FaultConsole'
import { VerificationFooter } from './VerificationFooter'

export function CacheLifePresetsLab() {
  const state = usePresetProbe()
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="cacheLife 커스텀 수명 프리셋 전역 정의 (next.config.ts)"
        concept="next.config.ts 최상위 cacheLife에 짧은/중간/긴 수명 프리셋 3개를 이름으로 선언해 두면, 어느 'use cache' 함수든 cacheLife('그 이름') 한 줄로 같은 stale/revalidate/expire를 재사용한다. 이 데모는 본문이 같은 함수 3개를 프리셋 이름만 바꿔 호출하고, 실제 캐시 교체 시점을 서버 시각으로 잰다."
        steps={[
          {
            step: 1,
            title: '[자동 측정 시작] 클릭',
            description: '5초마다 probe Route Handler가 세 프리셋 함수를 한 번씩 호출해 캐시 ID·생성 시각·응답 헤더를 기록합니다.',
            actionBadge: '측정 시작',
          },
          {
            step: 2,
            title: '30초 이상 지켜보며 카드별 교체 시점 비교',
            description: '짧은 수명(revalidate 20초)은 나이가 20초를 넘긴 뒤 새로 계산되고, 같은 회차에 중간 수명(50초)은 그대로 재사용됩니다.',
            actionBadge: '수명 비교',
            observe: '짧은 수명 카드만 "새로 계산"으로 바뀌는 회차',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '잘못된 값 실행 버튼 2개를 누르고 검증 패널 확인',
            description: 'revalidate > expire와 선언하지 않은 이름이 실제 Next.js 오류로 거부되는지 확인합니다.',
            actionBadge: '결과 검증',
            observe: '수명 분기 관측 + 오류 2건이면 일치',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="전역 cacheLife 프리셋 수명 측정 실습">
        <div className="space-y-4">
          <PresetProbeConsole state={state} />
          <FaultConsole state={state} />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter state={state} />
    </DemoContainer>
  )
}
