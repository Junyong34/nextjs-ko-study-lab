import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { StrategyOrderWorkspace } from './components/StrategyOrderWorkspace'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/script 배치 전략: 실행 순서 · 라우트 로드 범위 · 중복 방지"
        concept="한 화면에 서드파티 스크립트 여러 개를 둘 때, 실제 실행 순서는 선언 순서가 아니라 strategy와 도착 시점이 정하고, 로드 범위는 스크립트를 둔 layout/page가 정하며, 중복 실행은 id가 막습니다. 로컬 Route Handler가 서빙하는 실제 JS의 실행 시각으로 확인합니다."
        steps={[
          {
            step: 1,
            title: '실측 타임라인에서 실행 순서 확인',
            description: '먼저 선언된 core-sdk(800ms 지연)보다 core-plugin이 먼저 실행되고, onReady 뒤에 렌더한 chained 플러그인만 코어를 찾는지, chat-widget이 load 이벤트 뒤에 오는지 봅니다.',
            actionBadge: '순서 관찰',
          },
          {
            step: 2,
            title: '[campaign] → [campaign/detail] → [루트 페이지] 이동',
            description: 'Link로 실제 하위 라우트를 오가며 layout-analytics와 core-sdk가 다시 실행되지 않는지, campaign-pixel이 campaign 진입 때 처음 요청되는지 확인합니다.',
            actionBadge: 'Link 이동',
          },
          {
            step: 3,
            title: '[위젯 슬롯 추가] / [마지막 슬롯 제거] 반복',
            description: '같은 id의 스크립트는 1회로 고정되고, id 없는 인라인 스크립트만 마운트마다 늘어나는지 봅니다.',
            actionBadge: 'id 중복 방지',
            observe: '4개 판정이 모두 실측값으로 "일치"가 되는지 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <StrategyOrderWorkspace />
    </DemoContainer>
  )
}
